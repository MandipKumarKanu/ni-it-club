const express = require("express");
const router = express.Router();
const {
  getProjects,
  getAllProjectsAdmin,
  getProjectById,
  createProject,
  updateProject,
  toggleProjectFeatured,
  updateProjectStatus,
  deleteProjectScreenshot,
  deleteProject,
  getProjectStats,
} = require("../controllers/projectController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getProjects)
  .post(
    protect,
    admin,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "screenshots", maxCount: 5 },
    ]),
    createProject
  );

router.get("/admin/all", protect, admin, getAllProjectsAdmin);
router.get("/stats", protect, admin, getProjectStats);
router.patch("/:id/featured", protect, admin, toggleProjectFeatured);
router.patch("/:id/status", protect, admin, updateProjectStatus);
router.delete("/:id/screenshots/:screenshotId", protect, admin, deleteProjectScreenshot);

router
  .route("/:id")
  .get(getProjectById)
  .put(
    protect,
    admin,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "screenshots", maxCount: 5 },
    ]),
    updateProject
  )
  .delete(protect, admin, deleteProject);

module.exports = router;
