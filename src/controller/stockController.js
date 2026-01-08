const StockService = require("../service/stockService");

module.exports = class StockController {
    static async entry(req, res) {
        const { componentId, quantity, userCpf } = req.body;

        if (!componentId || !quantity || !userCpf) {
            return res.status(400).json({
                error: true,
                message: "Missing required fields."
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                error: true,
                message: "Quantity must be positive."
            });
        }

        try {
            await StockService.entry(componentId, quantity, userCpf);
            return res.status(200).json({
                error: false,
                message: "Components added successfully."
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error."
            });
        }
    }

    static async exit(req, res) {

    }
}