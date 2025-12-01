const express = require("express");
const router = express.Router();
const {
  getTeamMembers,
  getAllTeamMembersAdmin,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  reorderTeamMembers,
  deleteTeamMember,
} = require("../controllers/teamController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getTeamMembers)
  .post(protect, admin, upload.single("image"), createTeamMember);

router.get("/admin/all", protect, admin, getAllTeamMembersAdmin);
router.put("/reorder", protect, admin, reorderTeamMembers);

router
  .route("/:id")
  .get(getTeamMemberById)
  .put(protect, admin, upload.single("image"), updateTeamMember)
  .delete(protect, admin, deleteTeamMember);

module.exports = router;
