const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

// Developer Analytics Routes
router.get("/stats", authMiddleware, analyticsController.getUserAnalytics);
router.post("/profile", authMiddleware, analyticsController.updateProfileHandles);

module.exports = router;
