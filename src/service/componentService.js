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
}