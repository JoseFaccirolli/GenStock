const connect = require("../db/connect");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = class userController {
    static async createUser(req, res) {
        const { userCpf, userEmail, userPassword, userName } = req.body

        if (!userCpf || !userEmail || !userPassword || !userName) {
            return res.status(400).json({ error: "All fields are required!" })
        }
        if (isNaN(userCpf) || userCpf.length !== 11) {
            return res.status(400).json({ error: "Invalid CPF. Must contain 11 numeric characters." })
        }
        if (!userEmail.includes('@')) {
            return res.status(400).json({ error: "Invalid Email. Must contain @" })
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);
        const query = `INSERT INTO user (user_cpf, user_email, user_password, user_name)
        VALUES (?, ?, ?, ?)`
        const values = [userCpf, userEmail, hashedPassword, userName]

        try {
            connect.query(query, values, (err) => {
                if (err) {
                    console.log(err)
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({ error: "CPF or Email already registered." })
                    }
                    if (err.sqlMessage) {
                        return res.status(400).json({ error: err.sqlMessage })
                    }
                    return res.status(500).json({ error: "Internal server error" })
                }
                return res.status(201).json({ message: "User created successfully" })
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" })
        }
    }

    static async readAllUsers(req, res) {
        const query = `SELECT user_cpf, user_email, user_name FROM user`
        try {
            connect.query(query, (err, results) => {
                if (err) {
                    console.log(err)
                    if (err.sqlMessage) {
                        return res.status(400).json({ error: err.sqlMessage })
                    }
                    return res.status(500).json({ error: "Internal server error" })
                }
                if (!results) {
                    return res.status(404).json({ error: "No users found" })
                }
                return res.status(200).json({ data: results })
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" })
        }
    } 
}