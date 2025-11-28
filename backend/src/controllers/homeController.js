const Settings = require("../models/Settings");
const TeamMember = require("../models/TeamMember");

// @desc    Get home page data (public)
// @route   GET /api/home
// @access  Public
const getHomeData = async (req, res) => {
  try {
    // Get settings
    const settings = await Settings.getSettings();

    // Get active team members
    const teamMembers = await TeamMember.find({ status: "active" })
      .sort({ position: 1 })
      .select("name role image socialLinks skills");

    // Prepare response
    const homeData = {
      // Site info
      site: {
        name: settings.siteName,
        tagline: settings.siteTagline,
        description: settings.siteDescription,
        website: settings.website,
        logo: settings.logo,
      },

      // Hero section
      hero: {
        title1: settings.heroTitle1,
        title2: settings.heroTitle2,
        subtitle: settings.heroSubtitle,
      },

      // About section
      about: {
        title: settings.aboutTitle,
        description: settings.aboutDescription,
      },

      // Team members
      teamMembers,
    };

    res.json(homeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHomeData,
};
