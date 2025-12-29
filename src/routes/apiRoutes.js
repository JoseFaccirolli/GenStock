const router = require("express").Router();
const ComponentController = require("../controller/componentController");
const userController = require("../controller/userController");

// -------------------- USUARIO -------------------- //
router.post("/user", userController.createUser);
router.get("/user", userController.readAllUsers);
router.patch("/user/:userCpf", userController.updateUser);
router.delete("/user/:userCpf", userController.deleteUser);
router.post("/user/login", userController.loginUser);

// -------------------- COMPONENTS -------------------- //
router.post("/component", ComponentController.createComponent);

module.exports = router;