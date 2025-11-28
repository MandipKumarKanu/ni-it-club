const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["general", "membership", "events", "support", "partnership", "other"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    repliedAt: {
      type: Date,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering
contactSchema.index({ status: 1, createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
