const UserService = require("../service/userService");
module.exports = class UserController {
    static async createUser(req, res) {
        const { userCpf, userEmail, userPassword, userName } = req.body;

        if (!userCpf || !userEmail || !userPassword || !userName) {
            return res.status(400).json({
                error: true,
                message: "All fields are required!"
            });
        }
        
        try {
            await UserService.createUser(userCpf, userEmail, userPassword, userName);
                return res.status(201).json({
                    error: false,
                    message: "User created successfully"
                });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal server error"
            });
        }
    }

    static async readAllUsers(req, res) {
        try {
            const users = await UserService.readAllUsers();
                return res.status(200).json({
                    error: false,
                    message: "Users fetched successfully",
                    data: users
                });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal server error"
            });
        }
    }

    static async updateUser(req, res) {
        const { userCpf } = req.params;
        const { userEmail, userPassword, userName } = req.body;

        if (!userEmail && !userPassword && !userName) {
            return res.status(400).json({
                error: true,
                message: "No fields provided for update."
            });
        }

        try {
            await UserService.updateUser(userCpf, { userEmail, userPassword, userName });
            return res.status(200).json({
                error: false,
                message: "User updated successfully"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal server error"
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
            const [result] = await connect.query(query, [userCpf]);
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: true,
                    message: "User not found"
                });
            }
            return res.status(200).json({
                error: false,
                message: "User deleted successfully"
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