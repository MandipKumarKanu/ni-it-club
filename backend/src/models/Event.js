const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Workshop", "Hackathon", "Tech Talk", "Study Group", "Social", "Competition", "Other"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date, // For multi-day events
    },
    timeFrom: {
      type: String,
      required: true,
    },
    timeTo: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    shortDetails: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isRegisterable: {
      type: Boolean,
      default: false,
    },
    registrationLink: {
      type: String,
      default: "",
    },
    capacity: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    addToCalendarLink: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    speakers: [
      {
        name: String,
        title: String,
        image: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ category: 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
