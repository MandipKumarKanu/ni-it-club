const Settings = require("../models/Settings");
const TeamMember = require("../models/TeamMember");
const Project = require("../models/Project");
const Event = require("../models/Event");
const Gallery = require("../models/Gallery");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public stats only
// @route   GET /api/settings/stats
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    const {
      siteName,
      siteTagline,
      siteDescription,
      contactEmail,
      contactPhone,
      address,
      socialLinks,
      stats,
      heroTitle,
      heroSubtitle,
      aboutTitle,
      aboutDescription,
      features,
      seo,
    } = req.body;

    // Update fields if provided
    if (siteName !== undefined) settings.siteName = siteName;
    if (siteTagline !== undefined) settings.siteTagline = siteTagline;
    if (siteDescription !== undefined) settings.siteDescription = siteDescription;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (address !== undefined) settings.address = address;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (aboutTitle !== undefined) settings.aboutTitle = aboutTitle;
    if (aboutDescription !== undefined) settings.aboutDescription = aboutDescription;

    // Update social links
    if (socialLinks) {
      const parsedLinks = typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;
      settings.socialLinks = parsedLinks;
    }

    // Update stats
    if (stats) {
      const parsedStats = typeof stats === "string" ? JSON.parse(stats) : stats;
      settings.stats = { ...settings.stats.toObject(), ...parsedStats };
    }

    // Update features
    if (features) {
      const parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
      settings.features = { ...settings.features.toObject(), ...parsedFeatures };
    }

    // Update SEO
    if (seo) {
      const parsedSeo = typeof seo === "string" ? JSON.parse(seo) : seo;
      settings.seo = { ...settings.seo.toObject(), ...parsedSeo };
    }

    // Handle logo upload
    if (req.files && req.files.logo) {
      if (settings.logo?.public_id) {
        await deleteFromCloudinary(settings.logo.public_id);
      }
      const result = await uploadToCloudinary(req.files.logo[0].buffer);
      settings.logo = { url: result.secure_url, public_id: result.public_id };
    }

    // Handle favicon upload
    if (req.files && req.files.favicon) {
      if (settings.favicon?.public_id) {
        await deleteFromCloudinary(settings.favicon.public_id);
      }
      const result = await uploadToCloudinary(req.files.favicon[0].buffer);
      settings.favicon = { url: result.secure_url, public_id: result.public_id };
    }

    // Handle OG image upload
    if (req.files && req.files.ogImage) {
      if (settings.seo?.ogImage?.public_id) {
        await deleteFromCloudinary(settings.seo.ogImage.public_id);
      }
      const result = await uploadToCloudinary(req.files.ogImage[0].buffer);
      settings.seo.ogImage = { url: result.secure_url, public_id: result.public_id };
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update stats only
// @route   PATCH /api/settings/stats
// @access  Private/Admin
const updateStats = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const { membersCount, projectsCount, eventsCount, partnersCount, workshopsCount, yearsActive } = req.body;

    if (membersCount !== undefined) settings.stats.membersCount = membersCount;
    if (projectsCount !== undefined) settings.stats.projectsCount = projectsCount;
    if (eventsCount !== undefined) settings.stats.eventsCount = eventsCount;
    if (partnersCount !== undefined) settings.stats.partnersCount = partnersCount;
    if (workshopsCount !== undefined) settings.stats.workshopsCount = workshopsCount;
    if (yearsActive !== undefined) settings.stats.yearsActive = yearsActive;

    const updatedSettings = await settings.save();
    res.json(updatedSettings.stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Recalculate stats from database
// @route   POST /api/settings/stats/recalculate
// @access  Private/Admin
const recalculateStats = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    // Calculate stats from actual data
    const membersCount = await TeamMember.countDocuments({ status: "active" });
    const projectsCount = await Project.countDocuments({ status: { $in: ["active", "completed"] } });
    const eventsCount = await Event.countDocuments({ status: { $ne: "draft" } });

    // Update stats
    settings.stats.membersCount = membersCount;
    settings.stats.projectsCount = projectsCount;
    settings.stats.eventsCount = eventsCount;

    const updatedSettings = await settings.save();
    res.json({
      message: "Stats recalculated successfully",
      stats: updatedSettings.stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add social link
// @route   POST /api/settings/social-links
// @access  Private/Admin
const addSocialLink = async (req, res) => {
  try {
    const { platform, url, isActive } = req.body;
    const settings = await Settings.getSettings();

    settings.socialLinks.push({
      platform,
      url,
      isActive: isActive !== undefined ? isActive : true,
    });

    const updatedSettings = await settings.save();
    res.status(201).json(updatedSettings.socialLinks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update social link
// @route   PUT /api/settings/social-links/:linkId
// @access  Private/Admin
const updateSocialLink = async (req, res) => {
  try {
    const { platform, url, isActive } = req.body;
    const settings = await Settings.getSettings();

    const linkIndex = settings.socialLinks.findIndex(
      (link) => link._id.toString() === req.params.linkId
    );

    if (linkIndex === -1) {
      return res.status(404).json({ message: "Social link not found" });
    }

    if (platform) settings.socialLinks[linkIndex].platform = platform;
    if (url) settings.socialLinks[linkIndex].url = url;
    if (isActive !== undefined) settings.socialLinks[linkIndex].isActive = isActive;

    const updatedSettings = await settings.save();
    res.json(updatedSettings.socialLinks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete social link
// @route   DELETE /api/settings/social-links/:linkId
// @access  Private/Admin
const deleteSocialLink = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    const linkIndex = settings.socialLinks.findIndex(
      (link) => link._id.toString() === req.params.linkId
    );

    if (linkIndex === -1) {
      return res.status(404).json({ message: "Social link not found" });
    }

    settings.socialLinks.splice(linkIndex, 1);
    await settings.save();

    res.json({ message: "Social link removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (admin overview)
// @route   GET /api/settings/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalMembers = await TeamMember.countDocuments();
    const activeMembers = await TeamMember.countDocuments({ status: "active" });
    const totalProjects = await Project.countDocuments();
    const featuredProjects = await Project.countDocuments({ isFeatured: true });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: "upcoming" });
    const totalGalleryItems = await Gallery.countDocuments();

    // Get recent activity
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name status createdAt");
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status date");
    const recentMembers = await TeamMember.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name role status createdAt");

    res.json({
      counts: {
        members: { total: totalMembers, active: activeMembers },
        projects: { total: totalProjects, featured: featuredProjects },
        events: { total: totalEvents, upcoming: upcomingEvents },
        gallery: { total: totalGalleryItems },
      },
      recentActivity: {
        projects: recentProjects,
        events: recentEvents,
        members: recentMembers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  getPublicStats,
  updateSettings,
  updateStats,
  recalculateStats,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getDashboardStats,
};
