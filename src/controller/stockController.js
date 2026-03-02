const StockService = require("../service/stockService");

module.exports = class StockController {
    static async entry(req, res) {
        const userId = req.user.id;
        const { componentId, quantity} = req.body;

        if (!componentId || !quantity) {
            return res.status(400).json({
                error: true,
                message: "Missing required fields."
            });
        }
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({
                error: true,
                message: "Quantity must be numeric and positive."
            });
        }

        try {
            await StockService.entry(componentId, quantity, userId);
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
        const userId = req.user.id;
        const { componentId, quantity } = req.body;

        if (!componentId || !quantity) {
            return res.status(400).json({
                error: true,
                message: "Missing required fields."
            });
        }
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({
                error: true,
                message: "Quantity must be numeric and positive."
            });
        }

        try {
            await StockService.exit(componentId, quantity ,userId);
            return res.status(200).json({
                error: false,
                message: "Component subtracted successfully"
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error"
            });
        }
    }

    static async readAllLogs(req, res) {
        const userId = req.user.id;

        try {
            const log = await StockService.readAllLogs(userId);
            return res.status(200).json({
                error: false,
                message: "Logs fetched successfully.",
                data: log
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error."
            });
        }
    }

    static async readLogById(req, res) {
        const { componentId } = req.params;
        const userId = req.user.id;

        try {
            const log = await StockService.readLogById(componentId, userId);
            return res.status(200).json({
                error: false,
                message: "Logs fetched successfully.",
                data: log
            }); 
        } catch (error) {
            return res.status(error.status || 500).json({
                error: true,
                message: error.message || "Internal Server Error."
            });
        }
    }
}
