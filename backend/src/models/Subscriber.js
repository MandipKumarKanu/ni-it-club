const mongoose = require("mongoose");
const crypto = require("crypto");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "active", "unsubscribed", "bounced"],
      default: "active",
    },
    preferences: {
      events: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      digest: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
    },
    source: {
      type: String,
      enum: ["website", "admin", "import"],
      default: "website",
    },
    unsubscribeToken: {
      type: String,
      unique: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    lastEmailSentAt: {
      type: Date,
    },
    emailsSentCount: {
      type: Number,
      default: 0,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unsubscribe token before saving
subscriberSchema.pre("save", function (next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

// Index for faster queries
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ status: 1 });
subscriberSchema.index({ unsubscribeToken: 1 });
subscriberSchema.index({ createdAt: -1 });

// Static method to get active subscribers
subscriberSchema.statics.getActiveSubscribers = function (preferences = null) {
  const query = { status: "active" };
  if (preferences) {
    query[`preferences.${preferences}`] = true;
  }
  return this.find(query).select("email name preferences");
};

// Static method to get subscriber stats
subscriberSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ status: "active" });
  const pending = await this.countDocuments({ status: "pending" });
  const unsubscribed = await this.countDocuments({ status: "unsubscribed" });

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const newThisMonth = await this.countDocuments({
    subscribedAt: { $gte: thisMonth },
    status: "active",
  });

  const bySource = await this.aggregate([
    { $group: { _id: "$source", count: { $sum: 1 } } },
  ]);

  return {
    total,
    active,
    pending,
    unsubscribed,
    newThisMonth,
    bySource: bySource.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
  };
};

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
