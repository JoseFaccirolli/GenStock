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

        if (!userCpf) {
            return res.status(400).json({
                error: true,
                message: "CPF is required."
            });
        }

        try {
            await UserService.deleteUser(userCpf);
            return res.status(200).json({
                error: false,
                message: "User deleted successfully"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal server error"
            });
        }
    }
}