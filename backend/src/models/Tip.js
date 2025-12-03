const mongoose = require("mongoose");

const tipAnalyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["view", "share"],
    required: true,
  },
  platform: {
    type: String,
    default: "",
  },
  sessionId: {
    type: String,
    default: "",
  },
  referrer: {
    type: String,
    default: "",
  },
  userAgent: {
    type: String,
    default: "",
  },
  ip: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const tipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    coverImage: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    deadline: {
      type: Date,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    uniqueViewers: {
      type: Number,
      default: 0,
    },
    analytics: [tipAnalyticsSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug from title
tipSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    return next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
  next();
});

module.exports = mongoose.model("Tip", tipSchema);
