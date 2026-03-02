const ComponentService = require("../service/componentService");

module.exports = class ComponentController {
    static async createComponent(req, res) {
        const userId = req.user.id;
        const { componentName, quantity, description } = req.body;

        if (!componentName || quantity === undefined || !userId) {
            return res.status(400).json({
                error: true,
                message: "Missing required fields."
            });
        }
        if (isNaN(quantity) || quantity < 0) {
            return res.status(400).json({
                error: true,
                message: "Quantity must be numeric and positive."
            });
        }

        try {
            await ComponentService.createComponent(componentName, quantity, description, userId);
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
        const userId = req.user.id;

        try {
            const components = await ComponentService.readAllComponents(userId);
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
        const userId = req.user.id;
        const { componentId } = req.params;
        const { componentName, description} = req.body;

        if (!componentName && description === undefined) {
            return res.status(400).json({
                error: true,
                message: "No fields provided for update."
            });
        }

        try {
            await ComponentService.updateComponent(componentName, description, componentId, userId);
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

    static async deleteComponent(req, res) {
        const { componentId } = req.params;
        const userId = req.user.id;

        if (!componentId || isNaN(componentId)) {
            return res.status(400).json({
                error: true,
                message: "Invalid Component ID."
            });
        }

        try {
            await ComponentService.deleteComponent(componentId, userId);
            return res.status(200).json({
                error: false,
                message: "Component deleted successfully"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error"
            });
        }
    }
}
