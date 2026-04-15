const express = require('express');
const router = express.Router();

// Controllers
const { showDashboard, showStudentDashboard } = require("../controller/dashboardController");

// Middleware
const auth = require("../middleware/auth");
const { studentOnly, adminOnly } = require("../middleware/roleAuth");

// Routes
router.get("/", auth, adminOnly, showDashboard);
router.get("/student/dashboard", auth, studentOnly, showStudentDashboard);

module.exports = router;