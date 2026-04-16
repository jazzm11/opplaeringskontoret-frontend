const express = require("express");
const router = express.Router();

// Controllers
const { showBedriftDashboard } = require("../controller/bedriftDashboardController");

// Middleware
const auth = require("../middleware/auth");

// Routes
router.get("/bedrift/dashboard", auth, showBedriftDashboard);

module.exports = router;

