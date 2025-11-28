const Gallery = require("../models/Gallery");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} = require("../utils/cloudinaryUpload");

// Helper to transform gallery with thumbnail URLs
const transformGallery = (g) => {
  const gallery = g.toObject ? g.toObject() : g;
  return {
    ...gallery,
    featuredImage: {
      url: gallery.featuredImage?.url || "",
      public_id: gallery.featuredImage?.public_id || "",
      thumb: gallery.featuredImage?.public_id
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_800,h_450/${gallery.featuredImage.public_id}.jpg`
        : gallery.featuredImage?.url || "",
    },
    images: (gallery.images || []).map((img) => ({
      _id: img._id,
      url: img.url,
      public_id: img.public_id,
      caption: img.caption || "",
      thumb: img.public_id
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_400,h_300/${img.public_id}.jpg`
        : img.url,
    })),
  };
};

// Helper to parse array fields
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return field
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// @desc    Get all galleries
// @route   GET /api/gallery
// @access  Public
const getGalleries = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 9 } = req.query;
    const filter = {};

    // By default, only show published galleries
    if (status) {
      filter.status = status;
    } else {
      filter.status = "published";
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalDocs = await Gallery.countDocuments(filter);
    const galleries = await Gallery.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("event", "name category");

    const totalPages = Math.ceil(totalDocs / limitNum);

    res.json({
      docs: galleries.map(transformGallery),
      totalDocs,
      limit: limitNum,
      totalPages,
      page: pageNum,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all galleries for admin (including drafts)
// @route   GET /api/gallery/admin/all
// @access  Private/Admin
const getAllGalleriesAdmin = async (req, res) => {
  try {
    const galleries = await Gallery.find({})
      .sort({ date: -1 })
      .populate("event", "name category");
    res.json(galleries.map(transformGallery));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single gallery
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).populate(
      "event",
      "name category date"
    );

    if (gallery) {
      // Increment view count
      gallery.viewCount = (gallery.viewCount || 0) + 1;
      await gallery.save();

      res.json(transformGallery(gallery));
    } else {
      res.status(404).json({ message: "Gallery not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new gallery
// @route   POST /api/gallery
// @access  Private/Admin
const createGallery = async (req, res) => {
  try {
    const { title, description, date, category, tags, event, status } =
      req.body;

    // Handle featured image
    let featuredImage = { url: "", public_id: "" };
    if (req.files && req.files.featuredImage) {
      const result = await uploadToCloudinary(
        req.files.featuredImage[0].buffer
      );
      featuredImage = { url: result.secure_url, public_id: result.public_id };
    }

    // Handle multiple images
    let imagesArr = [];
    if (req.files && req.files.images) {
      const uploadPromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer)
      );
      const results = await Promise.all(uploadPromises);
      imagesArr = results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
        caption: "",
      }));
    }

    const gallery = new Gallery({
      title,
      description: description || "",
      date,
      category: category || "Other",
      tags: parseArrayField(tags),
      event: event || null,
      status: status || "published",
      featuredImage,
      images: imagesArr,
    });

    const createdGallery = await gallery.save();
    res.status(201).json(transformGallery(createdGallery));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a gallery
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGallery = async (req, res) => {
  try {
    const { title, description, date, category, tags, event, status } =
      req.body;

    const gallery = await Gallery.findById(req.params.id);

    if (gallery) {
      gallery.title = title || gallery.title;
      gallery.description =
        description !== undefined ? description : gallery.description;
      gallery.date = date || gallery.date;
      gallery.category = category || gallery.category;
      gallery.event = event !== undefined ? event : gallery.event;
      gallery.status = status || gallery.status;

      if (tags !== undefined) {
        gallery.tags = parseArrayField(tags);
      }

      // Handle new featured image (delete old one if replacing)
      if (req.files && req.files.featuredImage) {
        if (gallery.featuredImage?.public_id) {
          deleteFromCloudinary(gallery.featuredImage.public_id);
        }
        const result = await uploadToCloudinary(
          req.files.featuredImage[0].buffer
        );
        gallery.featuredImage = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      // Handle new images (append to existing)
      if (req.files && req.files.images) {
        const uploadPromises = req.files.images.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        const results = await Promise.all(uploadPromises);
        const newImages = results.map((result) => ({
          url: result.secure_url,
          public_id: result.public_id,
          caption: "",
        }));
        gallery.images = [...gallery.images, ...newImages];
      }

      const updatedGallery = await gallery.save();
      res.json(transformGallery(updatedGallery));
    } else {
      res.status(404).json({ message: "Gallery not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update image caption
// @route   PATCH /api/gallery/:id/images/:imageId/caption
// @access  Private/Admin
const updateImageCaption = async (req, res) => {
  try {
    const { caption } = req.body;
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    const image = gallery.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    image.caption = caption || "";
    await gallery.save();

    res.json(transformGallery(gallery));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Toggle gallery status
// @route   PATCH /api/gallery/:id/status
// @access  Private/Admin
const toggleGalleryStatus = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (gallery) {
      gallery.status = gallery.status === "published" ? "draft" : "published";
      const updatedGallery = await gallery.save();
      res.json(transformGallery(updatedGallery));
    } else {
      res.status(404).json({ message: "Gallery not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a gallery
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (gallery) {
      // Collect all public_ids for deletion from Cloudinary
      const publicIds = [];
      if (gallery.featuredImage?.public_id) {
        publicIds.push(gallery.featuredImage.public_id);
      }
      gallery.images.forEach((img) => {
        if (img.public_id) publicIds.push(img.public_id);
      });

      // Delete from Cloudinary
      if (publicIds.length > 0) {
        deleteMultipleFromCloudinary(publicIds);
      }

      await gallery.deleteOne();
      res.json({ message: "Gallery removed" });
    } else {
      res.status(404).json({ message: "Gallery not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a single image from a gallery
// @route   DELETE /api/gallery/:id/images/:imageId
// @access  Private/Admin
const deleteGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    const imageIndex = gallery.images.findIndex(
      (img) => img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found in gallery" });
    }

    const image = gallery.images[imageIndex];

    // Delete from Cloudinary if public_id exists
    if (image.public_id) {
      await deleteFromCloudinary(image.public_id);
    }

    // Remove image from array
    gallery.images.splice(imageIndex, 1);
    await gallery.save();

    res.json({ message: "Image removed from gallery" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get gallery statistics
// @route   GET /api/gallery/stats
// @access  Private/Admin
const getGalleryStats = async (req, res) => {
  try {
    const total = await Gallery.countDocuments();
    const published = await Gallery.countDocuments({ status: "published" });
    const draft = await Gallery.countDocuments({ status: "draft" });

    const totalImages = await Gallery.aggregate([
      { $project: { imageCount: { $size: "$images" } } },
      { $group: { _id: null, total: { $sum: "$imageCount" } } },
    ]);

    const byCategory = await Gallery.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      total,
      published,
      draft,
      totalImages: totalImages[0]?.total || 0,
      byCategory: byCategory.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
