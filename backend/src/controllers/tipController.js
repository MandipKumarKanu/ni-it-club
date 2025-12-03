const Tip = require("../models/Tip");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

// @desc    Get all tips
// @route   GET /api/tips
// @access  Public
const getTips = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tips = await Tip.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Tip.countDocuments();

    res.json({
      tips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single tip
// @route   GET /api/tips/:slug
// @access  Public
const getTip = async (req, res) => {
  try {
    const tip = await Tip.findOne({ slug: req.params.slug }).populate(
      "author",
      "name email"
    );

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    res.json(tip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single tip by ID
// @route   GET /api/tips/:id
// @access  Public
const getTipById = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    res.json(tip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a tip
// @route   POST /api/tips
// @access  Private/Admin
const createTip = async (req, res) => {
  try {
    const { title, content, deadline } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const tip = await Tip.create({
      title,
      content,
      deadline: deadline || null,
      coverImage: {
        url: result.secure_url,
        publicId: result.public_id,
      },
      author: req.user._id,
    });

    res.status(201).json(tip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a tip
// @route   PUT /api/tips/:id
// @access  Private/Admin
const updateTip = async (req, res) => {
  try {
    const { title, content, deadline } = req.body;
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    let coverImage = tip.coverImage;

    if (req.file) {
      // Delete old image
      if (tip.coverImage.publicId) {
        await deleteFromCloudinary(tip.coverImage.publicId);
      }
      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer);
      coverImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    tip.title = title || tip.title;
    tip.content = content || tip.content;
    if (deadline !== undefined) tip.deadline = deadline; // Allow clearing deadline if sent as null
    tip.coverImage = coverImage;

    // Re-generate slug if title changed (handled by pre-save hook)

    const updatedTip = await tip.save();
    res.json(updatedTip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a tip
// @route   DELETE /api/tips/:id
// @access  Private/Admin
const deleteTip = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    if (tip.coverImage.publicId) {
      await deleteFromCloudinary(tip.coverImage.publicId);
    }

    await tip.deleteOne();
    res.json({ message: "Tip removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Upload media (image/video) from editor
// @route   POST /api/tips/upload-media
// @access  Private/Admin
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// @desc    Get OG meta page for sharing
// @route   GET /api/tips/share/:slug
// @access  Public
const getTipSharePage = async (req, res) => {
  try {
    const tip = await Tip.findOne({ slug: req.params.slug });

    if (!tip) {
      return res.redirect(process.env.CLIENT_URL || "https://ni-itclub.web.app");
    }

    const siteUrl = process.env.CLIENT_URL || "https://ni-itclub.web.app";
    const tipUrl = `${siteUrl}/tips/${tip.slug}`;
    const description = tip.content.replace(/<[^>]*>/g, "").substring(0, 200) + "...";

    // Send HTML with proper OG meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${tip.title} | NI IT Club</title>
  <meta name="title" content="${tip.title} | NI IT Club">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${tipUrl}">
  <meta property="og:title" content="${tip.title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${tip.coverImage?.url || siteUrl + '/niit-c.png'}">
  <meta property="og:site_name" content="NI IT Club">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${tipUrl}">
  <meta name="twitter:title" content="${tip.title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${tip.coverImage?.url || siteUrl + '/niit-c.png'}">
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0;url=${tipUrl}">
  <link rel="canonical" href="${tipUrl}">
</head>
<body>
  <p>Redirecting to <a href="${tipUrl}">${tip.title}</a>...</p>
  <script>window.location.href = "${tipUrl}";</script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.redirect(process.env.CLIENT_URL || "https://ni-itclub.web.app");
  }
};

module.exports = {
  getTips,
  getTip,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
  uploadMedia,
  getTipSharePage,
};
