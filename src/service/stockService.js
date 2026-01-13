const pool = require("../database/connect");
const connect = require("../database/connect");

module.exports = class StockService {
    static async entry(componentId, quantity, userCpf) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const queryEntry = `UPDATE component SET quantity = quantity + ? WHERE component_id = ? AND fk_user_cpf = ?`;
            const entryValues = [quantity, componentId, userCpf];
            const [result] = await connection.execute(queryEntry, entryValues);

            if (result.affectedRows === 0) {
                throw { status: 404, message: "Component not found or access denied." }
            }

            const queryLog = `INSERT INTO stock_log (log_status, quantity_changed, fk_component_id, fk_user_cpf) 
            VALUES (?, ?, ?, ?)`;
            const logValues = ["in", quantity, componentId, userCpf];
            await connection.execute(queryLog, logValues);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();

            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                throw { status: 404, message: "User not found." }
            }

            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        } finally {
            connection.release();
        }
    }

    static async exit(componentId, quantity, userCpf) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const queryCheck = `SELECT quantity FROM component WHERE component_id = ? AND fk_user_cpf = ?`;
            const [rows] = await connection.execute(queryCheck, [componentId, userCpf]);

            if (rows.lenght === 0) {
                throw { status: 404, message: "Component not found, access denied." }
            }

            const currentQuantity = rows[0].quantity;

            if (currentQuantity < quantity) {
                throw { status: 400, message: "Insufficient stock." }
            }

            const queryExit = `UPDATE component SET quantity = quantity - ? WHERE component_id = ? AND fk_user_cpf = ?`;
            const exitValues = [quantity, componentId, userCpf];
            await connection.execute(queryExit, exitValues);

            const queryLog = `INSERT INTO stock_log (log_status, quantity_changed, fk_component_id, fk_user_cpf) 
            VALUES (?, ?, ?, ?)`;
            const logValues = ["out", quantity, componentId, userCpf];
            await connection.execute(queryLog, logValues);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            if (error.status) throw error;
            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                throw { status: 404, message: "User not found." }
            }
            throw { status: 500, message: "Internal Server Error." }
        } finally {
            connection.release();
        }
    }

    static async readAllLogs(userCpf) {
        const query = `SELECT 
        sl.log_id,
        sl.log_status,
        sl.quantity_changed,
        sl.data_log,
        c.component_name,
        u.user_name
        FROM stock_log sl
        JOIN component c ON sl.fk_component_id = c.component_id
        JOIN user u ON sl.fk_user_cpf = u.user_cpf
        WHERE sl.fk_user_cpf = ?`;

        try {
            const [log] = await connect.execute(query, [userCpf]);
            return log;        
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async readLogById(componentId, userCpf) {
        const query = `SELECT
        sl.log_id,
        sl.log_status,
        sl.quantity_changed,
        sl.data_log,
        c.component_name,
        u.user_name
        FROM stock_log sl
        JOIN component c ON sl.fk_component_id = c.component_id
        JOIN user u ON sl.fk_user_cpf = u.user_cpf
        WHERE sl.fk_component_id = ?
        AND sl.fk_user_cpf = ?`;

        const values = [componentId, userCpf];

        try {
            const [log] = await connect.execute(query, values);
            return log;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Iternal Server Error." }
        }
    }

}