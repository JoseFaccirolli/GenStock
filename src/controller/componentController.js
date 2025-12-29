const ComponentService = require("../service/componentService");

module.exports = class ComponentController {
    static async createComponent(req, res) {
        const { componentName, quantity, description, fkUserCpf } = req.body;
        
        if (!componentName || quantity === undefined || !fkUserCpf) {
            return res.status(400).json({
                error: true,
                message: "Missing required fields."
            });
        }

        try {
            await ComponentService.createComponent(componentName, quantity, description, fkUserCpf);
            return res.status(201).json({
                error: false,
                message: "Component successfully created"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error"
            });
        }
    }
}