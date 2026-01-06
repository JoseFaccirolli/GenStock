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
                message: "Component successfully created."
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error."
            });
        }
    }

    static async readAllComponents(req, res) {
        try {
            const components = await ComponentService.readAllComponents();
            return res.status(200).json({
                error: false,
                message: "Components fetched successfully.",
                components: components
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error."
            });
        }
    }

    static async updateComponent(req, res) {
        const { componentId } = req.params
        const { componentName, description } = req.body;

        if (!componentName && !description) {
            return res.status(400).json({
                error: true,
                message: "No fields provided for update."
            });
        }

        try {
            await ComponentService.updateComponent(componentName, description, componentId);
            return res.status(200).json({
                error: false,
                message: "Component updated successfully."
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error"
            });
        }
    }
}