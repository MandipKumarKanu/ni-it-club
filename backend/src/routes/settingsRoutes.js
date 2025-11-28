const express = require("express");
const router = express.Router();
const {
  getSettings,
  getPublicStats,
  updateSettings,
  updateStats,
  recalculateStats,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getDashboardStats,
} = require("../controllers/settingsController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getSettings);
router.get("/stats", getPublicStats);

// Admin routes
router.put(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  updateSettings
);
router.get("/dashboard", protect, admin, getDashboardStats);
router.patch("/stats", protect, admin, updateStats);
router.post("/stats/recalculate", protect, admin, recalculateStats);

// Social links management
router.post("/social-links", protect, admin, addSocialLink);
router.put("/social-links/:linkId", protect, admin, updateSocialLink);
router.delete("/social-links/:linkId", protect, admin, deleteSocialLink);

module.exports = router;
