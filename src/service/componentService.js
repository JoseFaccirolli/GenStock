const connect = require("../database/connect");

module.exports = class ComponentService {
    static async createComponent(componentName, quantity, description, userId) {
        const verifyQuery = `SELECT component_id, is_active FROM component WHERE component_name = ? AND fk_user_id = ?`;
        const verifyValues = [componentName, userId];
        try {
            const [rows] = await connect.execute(verifyQuery, verifyValues);
            if (rows.length > 0 && rows[0].is_active) {
                throw { status: 409, message: "This component already exists." }
            }
            if (rows.length > 0 && !rows[0].is_active) {
                const componentId = rows[0].component_id;
                const activationQuery = `UPDATE component SET is_active = 1, quantity = ?, description = ? WHERE component_id = ? AND fk_user_id = ?`;
                const activationValues = [quantity, description, componentId, userId];

                const [result] = await connect.execute(activationQuery, activationValues);
                return result;
            }
            const createQuery = `INSERT INTO component (component_name, quantity, description, fk_user_id)
    VALUES (?, ?, ?, ?)`;
            const createValues = [componentName, quantity, description, userId];

            const [result] = await connect.execute(createQuery, createValues);
            return result;
        } catch (error) {
            if (error.status) throw error;
            if (error.code === "ER_NO_REFERENCED_ROW_2"){
               throw { status: 404, message: "User not found." }
            }
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async readAllComponents(userId) {
        const query = `
        SELECT
            c.component_id, 
            c.component_name, 
            c.quantity, 
            c.description, 
            u.user_name as userName
        FROM component c 
        JOIN users u ON c.fk_user_id = u.user_id
        WHERE c.fk_user_id = ? AND c.is_active = 1
        `;

        try {
            const [components] = await connect.execute(query, [userId]);
            return components;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async updateComponent(componentName, description, componentId, userId) {
        if (description && description.length > 255) {
            throw { status: 413, message: "Description is too long." }
        }

        const updates = [];
        const values = [];

        if (componentName) {
            updates.push("component_name = ?");
            values.push(componentName);
        }

        if (description !== undefined) {
            updates.push("description = ?");
            values.push(description);
        }

        // Debug shielding
        if (updates.length === 0) {
            throw { status: 400, message: "No fields provided for update." };
        }

        values.push(componentId);
        values.push(userId);
        const query = `UPDATE component SET ${updates.join(", ")} WHERE component_id = ? AND fk_user_id = ? AND is_active = 1`;

        try {
            const [result] = await connect.execute(query, values);
            if (result.affectedRows === 0) {
                throw { status: 404, message: "Component or user not found." }
            }
            return result;
        } catch (error) {
            if (error.status) throw error;
            if (error.code === "ER_DUP_ENTRY") {
                throw { status: 409, message: "This name belongs to an archived, inactive or existing item." }
            }
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async deleteComponent(componentId, userId) {
        const connection = await connect.getConnection();

        try {
            await connection.beginTransaction();

            const selectQuery = `SELECT * FROM component WHERE component_id = ? AND fk_user_id = ?`;
            const selectValues = [componentId, userId];

            const [rows] = await connection.execute(selectQuery, selectValues);
            if (rows.length === 0) {
                throw { status: 404, message: "Component not found or access denied." }
            }
            const remaining = rows[0].quantity;

            const deleteQuery = `UPDATE component SET is_active = 0, quantity = 0 WHERE component_id = ? AND fk_user_id = ?`;
            const deleteValues = [componentId, userId];
            await connection.execute(deleteQuery, deleteValues);

            const logQuery = `INSERT INTO stock_log (log_status, quantity_changed, fk_component_id, fk_user_id) 
            VALUES (?, ?, ?, ?)`;
            const logValues = ["deleted", remaining, componentId, userId];
            await connection.execute(logQuery, logValues);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        } finally {
            connection.release();
        }
    }
}
