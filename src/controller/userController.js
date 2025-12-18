const { json } = require("express");
const connect = require("../db/connect");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = class userController {
    static async createUser(req, res) {
        const { userCpf, userEmail, userPassword, userName } = req.body
        const query = `INSERT INTO user (userCpf=?, userEmail=?, userPassword=?, userName=?)`
        const values = [userCpf, userEmail, userPassword, userName]

        if (!userCpf || !userEmail || !userPassword || !userName) {
            return res.status(400).json({ error: "All fields are required!" })
        }
        if (isNaN(userCpf) || userCpf.length !== 11) {
            return res.status(400).json({ error: "Invalid CPF. Must contain 11 numeric characters." })
        }
        if (!userEmail.include('@')) {
            return res.status(400).json({ error: "Invalid Email. Must contain @" })
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);

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
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
}