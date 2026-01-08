const pool = require("../database/connect");

module.exports = class StockService {
    static async entry(componentId, quantity, userCpf) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const queryEntry = `UPDATE component SET quantity = quantity + ? WHERE component_id = ?`;
            const entryValues = [quantity, componentId];
            const [result] = await connection.execute(queryEntry, entryValues);

            if (result.affectedRows === 0) {
                throw { status: 404, message: "Component not found." }
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

    static async exit() {
        
    }
}

/*
create table stock_log (
    log_id int auto_increment primary key,
    log_status enum("in", "out") not null,
    quantity_changed int not null,
    data_log datetime default current_timestamp,
    fk_component_id int not null,
    fk_user_cpf char(11) not null,
    foreign key(fk_component_id) references component(component_id),
    foreign key(fk_user_cpf) references user(user_cpf)
);
*/