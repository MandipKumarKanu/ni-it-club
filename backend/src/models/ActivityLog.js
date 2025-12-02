const mongoose = require("mongoose");
const logDbConnection = require("../config/logDb");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    userName: {
      type: String,
      default: "Anonymous",
    },
    userEmail: {
      type: String,
      default: null,
    },
    userRole: {
      type: String,
      enum: ["admin", "user", "guest", "system"],
      default: "guest",
    },
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT", "REGISTER", "EVENT_REGISTER", "GET", "POST", "PUT", "PATCH"],
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
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "SYSTEM"],
    },
    url: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    responseTime: {
      type: Number, // in milliseconds
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ module: 1 });

activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const ActivityLog = logDbConnection.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
