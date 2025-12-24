const connect = require("../database/connect");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = class UserService {
    static async createUser(userCpf, userEmail, userPassword, userName) {
        if (isNaN(userCpf) || userCpf.length !== 11) {
            throw {status: 400, message: "Invalid CPF. Must contain 11 numeric characters."}
        }
        if (!userEmail.includes("@")){
            throw {status: 400, message: "Invalide Email."}
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);

        const query = `INSERT INTO user (user_cpf, user_email, user_password, user_name)
        VALUES (?, ?, ?, ?)`;
        const values = [userCpf, userEmail, hashedPassword, userName];

        try {
            const [result] = await connect.execute(query, values);
            return result;
        } catch (error) {
            console.error(error)
            if (error.code === "ER_DUP_ENTRY") {
                throw {status: 400, message: "CPF or Email already registered."}
            }
            throw {status: 500, message: "Internal Server Error"}
        }
    }
    
    static async readAllUsers() {
        const query = `SELECT user_cpf, user_email, user_name FROM user`;
        
        try {
            const [users] = await connect.execute(query);
            return users;            
        } catch (error) {
            console.error(error);
            throw {status: 500, message: "Internal Server Error"}
        }
    }
}