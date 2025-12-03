const express = require("express");
const router = express.Router();
const {
  trackPageView,
  getTrafficStats,
  getRealtimeVisitors,
} = require("../controllers/trafficController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public route - track page views
router.post("/track", trackPageView);

// Admin routes - get statistics
router.get("/stats", protect, admin, getTrafficStats);
router.get("/realtime", protect, admin, getRealtimeVisitors);

module.exports = router;
