const express = require("express");
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getUnsubscribeInfo,
  getSubscribers,
  getSubscriberStats,
  addSubscriber,
  updateSubscriber,
  deleteSubscriber,
  sendNewsletter,
  exportSubscribers,
} = require("../controllers/newsletterController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/unsubscribe/:token", getUnsubscribeInfo);

// Admin routes
router.get("/subscribers", protect, admin, getSubscribers);
router.get("/stats", protect, admin, getSubscriberStats);
router.get("/export", protect, admin, exportSubscribers);
router.post("/subscribers", protect, admin, addSubscriber);
router.put("/subscribers/:id", protect, admin, updateSubscriber);
router.delete("/subscribers/:id", protect, admin, deleteSubscriber);
router.post("/send", protect, admin, sendNewsletter);

module.exports = router;
