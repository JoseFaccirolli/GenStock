const router = require("express").Router();
const userController = require("../controller/userController");

// -------------------- USUARIO -------------------- //
router.post("/user", userController.createUser);
router.get("/user", userController.readAllUsers);
router.patch("/user/:userCpf", userController.updateUser);
router.delete("/user/:userCpf", userController.deleteUser);
router.post("/user/login", userController.loginUser);

module.exports = router;