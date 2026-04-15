const express = require("express");
const router = express.Router();

// Middleware
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/roleAuth");

// Controller
const {
  showCreateBedrift,
  createBedrift,
  showRegisterElev,
  registerElev,
  showVurderingForm,
  sendVurdering,
} = require("../controller/bedriftController");

// GET
router.get("/bedrift/create", auth, adminOnly, showCreateBedrift);
router.get("/bedrift/register-elev", auth, adminOnly, showRegisterElev);
router.get("/bedrift/send-vurdering", auth, adminOnly, showVurderingForm);

// POST
router.post("/bedrift/create", auth, adminOnly, createBedrift);
router.post("/bedrift/register-elev", auth, adminOnly, registerElev);
router.post("/bedrift/send-vurdering", auth, adminOnly, sendVurdering);

module.exports = router;
