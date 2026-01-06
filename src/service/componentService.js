const connect = require("../database/connect");

module.exports = class ComponentService {
    static async createComponent(componentName, quantity, description, fkUserCpf) {
        const query = `INSERT INTO component (component_name, quantity, description, fk_user_cpf)
        VALUES (?, ?, ?, ?)`;
        const values = [componentName, quantity, description, fkUserCpf];

        try {
            const [result] = await connect.execute(query, values);
            return result;
        } catch (error) {
            if (error.status) throw error;
            console.error(error);
            if (error.code === "ER_NO_REFERENCED_ROW_2" || error.code === "ER_NO_REFERENCED_ROW_1") {
                throw { status: 404, message: "User not found. Component cannot be created." }
            }
            if (error.code === "ER_DUP_ENTRY") {
                throw { status: 409, message: "This component already exists." }
            }
            throw { status: 500, message: "Internal Server Error." }
        }

    }

    static async readAllComponents() {
        const query = `
        SELECT
            c.component_id, 
            c.component_name, 
            c.quantity, 
            c.description, 
            u.user_name 
        FROM component c 
        JOIN user u ON c.fk_user_cpf = u.user_cpf
        `;

        try {
            const [components] = await connect.execute(query);
            return components;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async updateComponent(componentName, description, componentId) {

        if (description && description.length > 255) {
            throw { status: 413, message: "Description is too long." }
        }

        const updates = [];
        const values = [];

        if (componentName) {
            updates.push("component_name = ?");
            values.push(componentName);
        }

        if (description) {
            updates.push("description = ?");
            values.push(description);
        }

        values.push(componentId);
        const query = `UPDATE component SET ${updates.join(", ")} WHERE component_id = ?`

        try {
            const [result] = await connect.execute(query, values);
            if (result.affectedRows === 0) {
                throw { status: 404, message: "Component not found." }
            }
            return result;
        } catch (error) {
            if (error.status) throw error;
            if (error.code === "ER_DUP_ENTRY") {
                throw { status: 409, message: "Component name already exists." }
            }
            throw { status: 500, message: "Internal Server Error." }
        }
    }
}