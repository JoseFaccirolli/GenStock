const connect = require("../db/connect");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = class UserController {
    static async createUser(req, res) {
        const { userCpf, userEmail, userPassword, userName } = req.body;

        if (!userCpf || !userEmail || !userPassword || !userName) {
            return res.status(400).json({
                error: true,
                message: "All fields are required!"
            });
        }
        if (isNaN(userCpf) || userCpf.length !== 11) {
            return res.status(400).json({
                error: true,
                message: "Invalid CPF. Must contain 11 numeric characters."
            });
        }
        if (!userEmail.includes('@')) {
            return res.status(400).json({
                error: true,
                message: "Invalid Email. Must contain @"
            });
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);
        const query = `INSERT INTO user (user_cpf, user_email, user_password, user_name)
        VALUES (?, ?, ?, ?)`;
        const values = [userCpf, userEmail, hashedPassword, userName];

        try {
            connect.query(query, values, (err) => {
                if (err) {
                    console.error(err);
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({
                            error: true,
                            message: "CPF or Email already registered."
                        });
                    }
                    return res.status(500).json({
                        error: true,
                        message: "Internal server error"
                    });
                }
                return res.status(201).json({
                    error: false,
                    message: "User created successfully"
                });
            });
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                error: true,
                message: "Internal server error"
            });
        }
    }

    static async readAllUsers(req, res) {
        const query = `SELECT user_cpf, user_email, user_name FROM user`;
        try {
            connect.query(query, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: true,
                        message: "Internal server error"
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: "Users fetched successfully",
                    data: results
                });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: true,
                message: "Internal server error"
            });
        }
    } 
}