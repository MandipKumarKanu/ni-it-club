const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["Hackathons", "Workshops", "Socials", "Competitions", "Tech Talks", "Other"],
      default: "Other",
    },
    featuredImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    images: [
      {
        url: { type: String },
        public_id: { type: String },
        caption: { type: String, default: "" },
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering
gallerySchema.index({ status: 1, date: -1 });
gallerySchema.index({ category: 1 });

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
