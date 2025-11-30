const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
