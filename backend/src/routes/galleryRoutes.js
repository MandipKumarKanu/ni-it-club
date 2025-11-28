const express = require("express");
const router = express.Router();
const {
  getGalleries,
  getAllGalleriesAdmin,
  getGalleryById,
  createGallery,
  updateGallery,
  updateImageCaption,
  toggleGalleryStatus,
  deleteGallery,
  deleteGalleryImage,
  getGalleryStats,
} = require("../controllers/galleryController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getGalleries)
  .post(
    protect,
    admin,
    upload.fields([
      { name: "featuredImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    createGallery
  );

// Admin routes
router.get("/admin/all", protect, admin, getAllGalleriesAdmin);
router.get("/stats", protect, admin, getGalleryStats);
router.patch("/:id/status", protect, admin, toggleGalleryStatus);
router.patch("/:id/images/:imageId/caption", protect, admin, updateImageCaption);

router
  .route("/:id")
  .get(getGalleryById)
  .put(
    protect,
    admin,
    upload.fields([
      { name: "featuredImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    updateGallery
  )
  .delete(protect, admin, deleteGallery);

// Delete individual image from gallery
router.delete("/:id/images/:imageId", protect, admin, deleteGalleryImage);

module.exports = router;
