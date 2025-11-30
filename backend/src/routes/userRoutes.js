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
const { getLogs } = require("../controllers/logController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);
router.route("/change-password").post(protect, changePassword);
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route("/logs/activity").get(protect, admin, getLogs);

module.exports = router;
