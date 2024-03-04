const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/saveScore", authMiddleware, scoreController.saveScore);

module.exports = router;
