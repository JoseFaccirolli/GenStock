const router = require("express").Router();
const verifyJWT = require("../middlewares/verifyJWT");
const ComponentController = require("../controller/componentController");
const StockController = require("../controller/stockController");
const UserController = require("../controller/userController");

// -------------------- USUARIO -------------------- //
router.post("/user", UserController.createUser);
router.get("/user", UserController.readAllUsers); // Somente para admin
router.patch("/user/:userId", UserController.updateUser);
router.delete("/user/:userId", UserController.deleteUser);
router.post("/user/login", UserController.loginUser);

// -------------------- COMPONENTS -------------------- //
router.post("/component", ComponentController.createComponent);
router.get("/component", verifyJWT, ComponentController.readAllComponents);
router.patch("/component/:componentId", verifyJWT, ComponentController.updateComponent);
router.delete("/component/:componentId", verifyJWT, ComponentController.deleteComponent); // soft delete

// -------------------- STOCK & LOG -------------------- //
router.patch("/stock/entry", verifyJWT, StockController.entry);
router.patch("/stock/exit", verifyJWT, StockController.exit);
router.get("/stock/log", verifyJWT, StockController.readAllLogs);
router.get("/stock/log/:componentId", verifyJWT, StockController.readLogById);

module.exports = router;