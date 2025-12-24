const connect = require("../database/connect");
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
                message: "Invalid Email."
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

    static async updateUser(req, res) {
        const { userCpf } = req.params;
        const { userEmail, userPassword, userName } = req.body;

        if (!userCpf || isNaN(userCpf) || userCpf.length !== 11) {
            return res.status(400).json({
                error: true,
                message: "Invalid CPF. Must contain 11 numeric characters."
            });
        }

        if (!userEmail && !userPassword && !userName) {
            return res.status(400).json({
                error: true,
                message: "No fields provided for update."
            });
        }

        const updates = []
        const values = []

        if (userEmail) {
            if (!userEmail.includes("@")) {
                return res.status(400).json({
                    error: true,
                    message: "Invalid Email."
                });
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
        
        values.push(userCpf);
        const query = `UPDATE user SET ${updates.join(", ")} WHERE user_cpf = ?`;

        try {
            connect.query(query, values, (err, results) => {
                if (err) {
                    console.error(err);
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({
                            error: true,
                            message: "Email already registered"
                        });
                    }
                    return res.status(500).json({
                        error: true,
                        message: "Internal server error"
                    });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        error: true,
                        message: "User not found"
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: "User updated successfully"
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

    static async deleteUser(req,res) {
        const { userCpf } = req.params;

        if (!userCpf || isNaN(userCpf) || userCpf.length !== 11) {
            return res.status(400).json({
                error: true,
                message: "Invalid Cpf. Must contain 11 numeric characters."
            });
        }
        const query = `DELETE FROM user WHERE user_cpf = ?`;

        try {
            connect.query(query, [userCpf], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: true,
                        message: "Internal server error"
                    });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        error: true,
                        message: "User not found"
                    });
                }
                return res.status(200).json({
                    error: false,
                    message: "User deleted successfully"
                });
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: true,
                message: "Internal server error"
            });
        }
    }
}