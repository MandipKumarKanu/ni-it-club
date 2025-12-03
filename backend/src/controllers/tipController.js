const Tip = require("../models/Tip");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");
const { getClientIP } = require("../utils/ipUtils");

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

    const userAgent = req.headers["user-agent"] || "";
    const ip = getClientIP(req);
    const referrer = req.headers["referer"] || req.query.ref || "";
    
    const isCrawler = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|telegram/i.test(userAgent);
    
    if (!isCrawler) {
      await Tip.findByIdAndUpdate(tip._id, {
        $inc: { shareCount: 1 },
        $push: {
          analytics: {
            type: "share",
            platform: referrer.includes("facebook") ? "facebook" 
              : referrer.includes("twitter") || referrer.includes("t.co") ? "twitter"
              : referrer.includes("linkedin") ? "linkedin"
              : referrer.includes("whatsapp") ? "whatsapp"
              : "direct",
            referrer,
            userAgent,
            ip,
            timestamp: new Date(),
          },
        },
      });
    }

    const siteUrl = process.env.CLIENT_URL || "https://ni-itclub.web.app";
    const tipUrl = `${siteUrl}/tips/${tip.slug}`;
    const description = tip.content.replace(/<[^>]*>/g, "").substring(0, 200) + "...";

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

// @desc    Track tip view
// @route   POST /api/tips/:slug/view
// @access  Public
const trackTipView = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const tip = await Tip.findOne({ slug: req.params.slug });

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ip = getClientIP(req);
    const referrer = req.headers["referer"] || "";

    const existingView = tip.analytics.find(
      (a) => a.type === "view" && a.sessionId === sessionId
    );

    const updateQuery = {
      $inc: { viewCount: 1 },
      $push: {
        analytics: {
          type: "view",
          sessionId: sessionId || "",
          referrer,
          userAgent,
          ip,
          timestamp: new Date(),
        },
      },
    };

    // Increment unique viewers only if new session
    if (!existingView && sessionId) {
      updateQuery.$inc.uniqueViewers = 1;
    }

    await Tip.findByIdAndUpdate(tip._id, updateQuery);

    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({ message: "Failed to track view" });
  }
};

// @desc    Track tip share
// @route   POST /api/tips/:slug/share
// @access  Public
const trackTipShare = async (req, res) => {
  try {
    const { platform, sessionId } = req.body;
    const tip = await Tip.findOne({ slug: req.params.slug });

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ip = getClientIP(req);

    await Tip.findByIdAndUpdate(tip._id, {
      $inc: { shareCount: 1 },
      $push: {
        analytics: {
          type: "share",
          platform: platform || "unknown",
          sessionId: sessionId || "",
          userAgent,
          ip,
          timestamp: new Date(),
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking share:", error);
    res.status(500).json({ message: "Failed to track share" });
  }
};

// @desc    Get tip analytics
// @route   GET /api/tips/:id/analytics
// @access  Private/Admin
const getTipAnalytics = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id).select(
      "title slug viewCount shareCount uniqueViewers analytics createdAt"
    );

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const viewsOverTime = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayViews = tip.analytics.filter((a) => {
        const aDate = new Date(a.timestamp).toISOString().split("T")[0];
        return a.type === "view" && aDate === dateStr;
      }).length;

      viewsOverTime.push({
        date: dateStr,
        views: dayViews,
      });
    }

    const sharesByPlatform = {};
    tip.analytics
      .filter((a) => a.type === "share")
      .forEach((a) => {
        const platform = a.platform || "unknown";
        sharesByPlatform[platform] = (sharesByPlatform[platform] || 0) + 1;
      });

    const recentActivity = tip.analytics
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20)
      .map((a) => ({
        type: a.type,
        platform: a.platform,
        timestamp: a.timestamp,
      }));

    const last7DaysViews = tip.analytics.filter(
      (a) => a.type === "view" && new Date(a.timestamp) >= last7Days
    ).length;
    const last7DaysShares = tip.analytics.filter(
      (a) => a.type === "share" && new Date(a.timestamp) >= last7Days
    ).length;

    res.json({
      tip: {
        _id: tip._id,
        title: tip.title,
        slug: tip.slug,
        createdAt: tip.createdAt,
      },
      stats: {
        totalViews: tip.viewCount,
        totalShares: tip.shareCount,
        uniqueViewers: tip.uniqueViewers,
        last7DaysViews,
        last7DaysShares,
      },
      viewsOverTime,
      sharesByPlatform,
      recentActivity,
    });
  } catch (error) {
    console.error("Error getting tip analytics:", error);
    res.status(500).json({ message: "Failed to get analytics" });
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
  trackTipView,
  trackTipShare,
  getTipAnalytics,
};
