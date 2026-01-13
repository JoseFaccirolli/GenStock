const router = require("express").Router();
const ComponentController = require("../controller/componentController");
const StockController = require("../controller/stockController");
const UserController = require("../controller/userController");

// -------------------- USUARIO -------------------- //
router.post("/user", UserController.createUser);
router.get("/user", UserController.readAllUsers);
router.patch("/user/:userCpf", UserController.updateUser);
router.delete("/user/:userCpf", UserController.deleteUser);
router.post("/user/login", UserController.loginUser);

// -------------------- COMPONENTS -------------------- //
router.post("/component", ComponentController.createComponent);
router.get("/component", ComponentController.readAllComponents);
router.patch("/component/:componentId", ComponentController.updateComponent);
router.delete("/component/:componentId", ComponentController.deleteComponent);

// -------------------- STOCK & LOG -------------------- //
router.patch("/stock/entry", StockController.entry);
router.patch("/stock/exit", StockController.exit);
router.get("/stock/log", StockController.readAllLogs);
router.get("/stock/log/:componentId", StockController.readLogById);

module.exports = router;