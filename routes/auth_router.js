const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/autoLogin", authController.loginWithToken);

module.exports = router;