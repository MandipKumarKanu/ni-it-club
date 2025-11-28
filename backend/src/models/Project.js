const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      required: true,
    },
    techstack: [
      {
        type: String,
      },
    ],
    link: {
      type: String,
    },
    github: {
      type: String,
      required: true,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    screenshots: [
      {
        url: { type: String },
        public_id: { type: String },
        caption: { type: String, default: "" },
      },
    ],
    contributors: [
      {
        name: { type: String },
        role: { type: String },
        github: { type: String },
        image: { type: String },
      },
    ],
    category: {
      type: String,
      enum: ["Web", "Mobile", "Desktop", "API", "AI/ML", "Game", "Other"],
      default: "Web",
    },
    tags: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "archived"],
      default: "active",
    },
    startDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectSchema.index({ status: 1, isFeatured: -1 });
projectSchema.index({ category: 1 });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
