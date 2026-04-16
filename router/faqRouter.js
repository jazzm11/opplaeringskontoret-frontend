const express = require("express");
const router = express.Router();

const { showFaq } = require("../controller/faqController");

router.get("/faq", showFaq);

module.exports = router;

