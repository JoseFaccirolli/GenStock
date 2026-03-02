const connect = require("../database/connect");

module.exports = class StockService {
    static async entry(componentId, quantity, userId) {
        const connection = await connect.getConnection();

        try {
            await connection.beginTransaction();

            const queryCheck = `SELECT quantity FROM components WHERE is_active = 1 AND component_id = ? AND fk_user_id = ?`;
            const [rows] = await connection.execute(queryCheck, [componentId, userId]);

            if (rows.length === 0) {
                throw { status: 404, message: "Component not found or access denied." }
            }

            const newQuantity = Number(rows[0].quantity) + Number(quantity);

            const queryEntry = `UPDATE components SET quantity = ? WHERE is_active = 1 AND component_id = ? AND fk_user_id = ?`;
            const entryValues = [newQuantity, componentId, userId];
            await connection.execute(queryEntry, entryValues);


            const queryLog = `INSERT INTO stock_logs (log_status, quantity_changed, quantity_after, fk_component_id, fk_user_id) 
            VALUES (?, ?, ?, ?, ?)`;
            const logValues = ["in", quantity, newQuantity, componentId, userId];
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

    static async exit(componentId, quantity, userId) {
        const connection = await connect.getConnection();

        try {
            await connection.beginTransaction();

            const queryCheck = `SELECT quantity FROM components WHERE is_active = 1 AND component_id = ? AND fk_user_id = ?`;
            const [rows] = await connection.execute(queryCheck, [componentId, userId]);

            if (rows.length === 0) {
                throw { status: 404, message: "Component not found or access denied." }
            }

            const currentQuantity = rows[0].quantity;

            if (currentQuantity < quantity) {
                throw { status: 400, message: "Insufficient stock." }
            }

            const newQuantity = Number(currentQuantity) - Number(quantity)

            const queryExit = `UPDATE components SET quantity = ? WHERE is_active = 1 AND component_id = ? AND fk_user_id = ?`;
            const exitValues = [newQuantity, componentId, userId];
            await connection.execute(queryExit, exitValues);

            const queryLog = `INSERT INTO stock_logs (log_status, quantity_changed, quantity_after, fk_component_id, fk_user_id) 
            VALUES (?, ?, ?, ?, ?)`;
            const logValues = ["out", quantity, newQuantity, componentId, userId];
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

    static async readAllLogs(userId) {
        const query = `SELECT 
        sl.log_id,
        sl.log_status,
        sl.quantity_changed,
        sl.quantity_after,
        sl.updated_at,
        c.component_name,
        u.user_name
        FROM stock_logs sl
        JOIN components c ON sl.fk_component_id = c.component_id
        JOIN users u ON sl.fk_user_id = u.user_id
        WHERE sl.fk_user_id = ?
        ORDER BY sl.updated_at DESC`;

        try {
            const [log] = await connect.execute(query, [userId]);
            return log;        
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async readLogById(componentId, userId) {
        const query = `SELECT
        sl.log_id,
        sl.log_status,
        sl.quantity_changed,
        sl.quantity_after,
        sl.updated_at,
        c.component_name,
        u.user_name
        FROM stock_logs sl
        JOIN components c ON sl.fk_component_id = c.component_id
        JOIN users u ON sl.fk_user_id = u.user_id
        WHERE sl.fk_component_id = ?
        AND sl.fk_user_id = ?
        ORDER BY sl.updated_at DESC`;

        const values = [componentId, userId];

        try {
            const [log] = await connect.execute(query, values);
            return log;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        }
    }
}