const express = require("express");
const router = express.Router();
const { 
  sendContactEmail,
  getContacts,
  getContactById,
  updateContact,
  replyToContact,
  deleteContact,
  getContactStats,
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public route
router.post("/", sendContactEmail);

// Admin routes
router.get("/", protect, admin, getContacts);
router.get("/stats", protect, admin, getContactStats);
router.route("/:id")
  .get(protect, admin, getContactById)
  .put(protect, admin, updateContact)
  .delete(protect, admin, deleteContact);
router.post("/:id/reply", protect, admin, replyToContact);

module.exports = router;
