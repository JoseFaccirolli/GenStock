const connect = require("../database/connect");

module.exports = class ComponentService {
    static async createComponent(componentName, quantity, description, userCpf) {
        const verifyQuery = `SELECT component_id, is_active FROM component WHERE component_name = ? AND fk_user_cpf = ?`;
        const verifyValues = [componentName, userCpf];
        try {
            const [rows] = await connect.execute(verifyQuery, verifyValues);
            if (rows.length > 0 && rows[0].is_active) {
                throw { status: 409, message: "This component already exists." }
            }
            if (rows.length > 0 && !rows[0].is_active) {
                const componentId = rows[0].component_id;
                const activationQuery = `UPDATE component SET is_active = 1, quantity = ?, description = ? WHERE component_id = ? AND fk_user_cpf = ?`;
                const activationValues = [quantity, description, componentId, userCpf];

                const [result] = await connect.execute(activationQuery, activationValues);
                return result;
            }
            const createQuery = `INSERT INTO component (component_name, quantity, description, fk_user_cpf)
    VALUES (?, ?, ?, ?)`;
            const createValues = [componentName, quantity, description, userCpf];

            const [result] = await connect.execute(createQuery, createValues);
            return result;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error" }
        }
    }

    static async readAllComponents(userCpf) {
        const query = `
        SELECT
            c.component_id, 
            c.component_name, 
            c.quantity, 
            c.description, 
            u.user_name as userName
        FROM component c 
        JOIN user u ON c.fk_user_cpf = u.user_cpf
        WHERE c.fk_user_cpf = ? AND c.is_active = 1
        `;

        try {
            const [components] = await connect.execute(query, [userCpf]);
            return components;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async updateComponent(componentName, description, componentId, userCpf) {
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
        values.push(userCpf);
        const query = `UPDATE component SET ${updates.join(", ")} WHERE component_id = ? AND fk_user_cpf = ? AND is_active = 1`;

        try {
            const [result] = await connect.execute(query, values);
            if (result.affectedRows === 0) {
                throw { status: 404, message: "Component not found." }
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

    static async deleteComponent(componentId, userCpf) {
        const query = `UPDATE component SET is_active = 0 WHERE component_id = ? AND fk_user_cpf = ?`;
        const values = [componentId, userCpf];

        try {
            const [result] = await connect.execute(query, values)
            if (result.affectedRows === 0) {
                throw { status: 404, message: "Component not found." }
            }
            return result;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error" }
        }
    }
}
