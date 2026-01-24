const connect = require("../database/connect");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = class UserService {
    static async createUser(userCpf, userEmail, userPassword, userName) {
        if (isNaN(userCpf) || userCpf.length !== 11) {
            throw {status: 400, message: "Invalid CPF. Must contain 11 numeric characters."}
        }
        if (!userEmail.includes("@")){
            throw {status: 400, message: "Invalid Email."}
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);
        const userId = crypto.randomUUID();
        const query = `INSERT INTO users (user_id, user_cpf, user_email, user_password, user_name)
        VALUES (?, ?, ?, ?, ?)`;
        const values = [userId, userCpf, userEmail, hashedPassword, userName];

        try {
            const [result] = await connect.execute(query, values);
            return result;
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                throw {status: 409, message: "CPF or Email already registered."}
            }
            throw {status: 500, message: "Internal Server Error."}
        }
    }
    
    static async readAllUsers() {
        const query = `SELECT user_id, user_cpf, user_email, user_name FROM users`;
        
        try {
            const [users] = await connect.execute(query);
            return users;            
        } catch (error) {
            throw {status: 500, message: "Internal Server Error."}
        }
    }

    static async updateUser(userId, { userEmail, userPassword, userName }) {

        const updates = []
        const values = []

        if (userEmail) {
            if (!userEmail.includes("@")) {
                throw { status: 400, message: "Invalid Email." }
            }
            updates.push("user_email = ?");
            values.push(userEmail);
        }
        if (userPassword) {
            const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);
            updates.push("user_password = ?");
            values.push(hashedPassword);
        }
        if (userName) {
            updates.push("user_name = ?");
            values.push(userName);
        }
        if (updates.length === 0) {
            throw { status: 400, message: "No fields to update." }
        }

        values.push(userId);
        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;

        try {
            const [result] = await connect.execute(query, values);
            if (result.affectedRows === 0) {
                throw { status: 404, message: "User not found." }
            } 
            return result;
        } catch (error) {
            if (error.status) throw error;
            if (error.code === "ER_DUP_ENTRY") {
                throw { status: 409, message: "Email already registered." }
            } 
            throw { status: 500, message: "Internal Server Error." }
        }
    }
    
    static async deleteUser(userId) {
        const query = `DELETE FROM users WHERE user_id = ?`;

        try {
            const [result] = await connect.execute(query, [userId]);
            if (result.affectedRows === 0) {
                throw { status: 404, message: "User not found." }
            }
            return result;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error." }
        }
    }

    static async loginUser(userEmail, userPassword) {
        const query = `SELECT user_id, user_cpf, user_email, user_name, user_password FROM users WHERE user_email = ?`;

        try {
            const [result] = await connect.execute(query, [userEmail]);
            if (result.length === 0) {
                throw { status: 401, message: "Invalid email or password." }
            }

            const user = result[0];
            const correctPassword = await bcrypt.compare(userPassword, user.user_password);

            if (!correctPassword) {
                throw { status: 401, message: "Invalid email or password." }
            }

            delete user.user_password;

            return user;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: "Internal Server Error" }
        }
    }
}
