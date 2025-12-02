const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const { getLogs, getLogStats, cleanupLogs } = require("../controllers/logController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route("/change-password").post(protect, changePassword);

router.get("/logs/activity", protect, admin, getLogs);
router.get("/logs/stats", protect, admin, getLogStats);
router.delete("/logs/cleanup", protect, admin, cleanupLogs);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
