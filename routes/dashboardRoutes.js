const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

router.get(
  "/overallScore",
  authMiddleware,
  dashboardController.getOverallScores
);
router.get(
  "/weeklyScores",
  authMiddleware,
  dashboardController.getWeeklyScores
);

module.exports = router;
