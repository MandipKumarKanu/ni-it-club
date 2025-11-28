const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshAccessToken);
router.route("/me").get(protect, getCurrentUser).put(protect, updateCurrentUser);

module.exports = router;
