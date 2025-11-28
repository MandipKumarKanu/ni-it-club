const express = require("express");
const router = express.Router();
const {
  getEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  toggleEventFeatured,
  updateEventStatus,
  deleteEvent,
  getEventStats,
} = require("../controllers/eventController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getEvents)
  .post(protect, admin, upload.single("image"), createEvent);

// Admin routes
router.get("/admin/all", protect, admin, getAllEventsAdmin);
router.get("/stats", protect, admin, getEventStats);
router.patch("/:id/featured", protect, admin, toggleEventFeatured);
router.patch("/:id/status", protect, admin, updateEventStatus);

router
  .route("/:id")
  .get(getEventById)
  .put(protect, admin, upload.single("image"), updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router;
