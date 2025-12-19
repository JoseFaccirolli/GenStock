const router = require("express").Router();
const userController = require("../controller/userController");

// -------------------- USUARIO -------------------- //
router.post("/user", userController.createUser);
router.get("/user", userController.readAllUsers);

module.exports = router;