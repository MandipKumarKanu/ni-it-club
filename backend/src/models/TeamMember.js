const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: [
      {
        type: String,
        required: true,
      },
    ],
    jobType: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Fullstack",
        "DevOps",
        "UI/UX",
        "Mobile",
        "Data",
        "Other",
      ],
      default: "Other",
    },
    bio: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],
    specializedIn: {
      type: String,
      default: "",
    },
    description: [
      {
        type: String,
      },
    ],
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      instagram: String,
      portfolio: String,
    },
    email: {
      type: String,
    },
    position: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "alumni"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting by position
teamMemberSchema.index({ position: 1 });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember;
