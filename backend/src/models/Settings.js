const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  membersCount: {
    type: Number,
    default: 0,
  },
  projectsCount: {
    type: Number,
    default: 0,
  },
  eventsCount: {
    type: Number,
    default: 0,
  },
  partnersCount: {
    type: Number,
    default: 0,
  },
  workshopsCount: {
    type: Number,
    default: 0,
  },
  yearsActive: {
    type: Number,
    default: 0,
  },
});

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: [
      "facebook",
      "instagram",
      "twitter",
      "linkedin",
      "github",
      "youtube",
      "discord",
      "telegram",
      "whatsapp",
      "email",
      "website",
    ],
  },
  url: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const settingsSchema = mongoose.Schema(
  {
    // Site metadata
    siteName: {
      type: String,
      default: "NI-IT Club",
    },
    siteTagline: {
      type: String,
      default: "Innovation through Technology",
    },
    siteDescription: {
      type: String,
      default:
        "NI-IT Club is a community of passionate tech enthusiasts dedicated to learning, building, and sharing knowledge.",
    },
    website: {
      type: String,
      default: "",
    },

    // Contact information
    contactEmail: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },

    // Social links
    socialLinks: [socialLinkSchema],

    // Stats (can be auto-calculated or manually set)
    stats: statsSchema,

    // Hero section settings
    heroTitle1: {
      type: String,
      default: "Welcome to",
    },
    heroTitle2: {
      type: String,
      default: "NI-IT Club",
    },
    heroSubtitle: {
      type: String,
      default: "Where Innovation Meets Technology",
    },

    // About section
    aboutTitle: {
      type: String,
      default: "About Us",
    },
    aboutDescription: {
      type: String,
      default: "",
    },

    // Logo and branding
    logo: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    favicon: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    // Feature flags
    features: {
      enableRegistrations: { type: Boolean, default: true },
      enableContactForm: { type: Boolean, default: true },
      showUpcomingEvents: { type: Boolean, default: true },
      showTeamSection: { type: Boolean, default: true },
      maintenanceMode: { type: Boolean, default: false },
    },

    // SEO settings
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      metaKeywords: [{ type: String }],
      ogImage: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists (singleton pattern)
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
