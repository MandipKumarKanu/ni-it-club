const Settings = require("../models/Settings");
const TeamMember = require("../models/TeamMember");
const Event = require("../models/Event");
const Gallery = require("../models/Gallery");
const Project = require("../models/Project");

// @desc    Get home page data (public)
// @route   GET /api/home
// @access  Public
const getHomeData = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    const teamMembers = await TeamMember.find({ status: "active" })
      .sort({ position: 1 })
      .select("name role image socialLinks specializedIn skills");

    const events = await Event.find({
      status: { $in: ["upcoming", "ongoing"] },
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(3)
      .select(
        "name category date timeFrom timeTo shortDetails location image registrationLink isRegisterable"
      );

    const gallery = await Gallery.find({ status: "published" })
      .sort({ date: -1 })
      .limit(4)
      .select("title description date category featuredImage images");

    const projects = await Project.find({
      status: "active",
      isFeatured: true,
    })
      .sort({ position: 1, createdAt: -1 })
      .limit(3)
      .select("name shortDescription techstack link github image category");

    const homeData = {
      site: {
        name: settings.siteName,
        tagline: settings.siteTagline,
        description: settings.siteDescription,
        website: settings.website,
        logo: settings.logo,
      },
      hero: {
        title1: settings.heroTitle1,
        title2: settings.heroTitle2,
        subtitle: settings.heroSubtitle,
      },
      about: {
        title: settings.aboutTitle,
        description: settings.aboutDescription,
        description2: settings.aboutDescription2,
      },
      teamMembers,
      // events,
      // gallery,
      // projects,
    };

    res.json(homeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHomeData,
};
