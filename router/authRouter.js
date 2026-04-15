const express = require('express');
const router = express.Router();

// Controllers
const { showLoginUser, showLoginStudent, showRegister, loginUser, register, loginStudent, logout } = require("../controller/authController");

// Routes

// GET
router.get("/login-user", showLoginUser);
router.get("/login-student", showLoginStudent);
router.get("/register", showRegister);
router.get("/logout", logout);

// POST
router.post("/login/user", loginUser);
router.post("/register/user", register);
router.post("/login/student", loginStudent);

module.exports = router;