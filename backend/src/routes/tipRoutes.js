const express = require("express");
const router = express.Router();
const {
  getTips,
  getTip,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
  uploadMedia,
} = require("../controllers/tipController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getTips)
  .post(protect, admin, upload.single("coverImage"), createTip);

// Route for editor media uploads
router.post(
  "/upload-media",
  protect,
  admin,
  upload.single("file"),
  uploadMedia
);

router
  .route("/:id")
  .get(getTipById)
  .put(protect, admin, upload.single("coverImage"), updateTip)
  .delete(protect, admin, deleteTip);

router.route("/slug/:slug").get(getTip);

module.exports = router;
