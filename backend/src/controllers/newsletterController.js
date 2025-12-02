const Subscriber = require("../models/Subscriber");
const sendEmail = require("../utils/emailService");
const {
  getNewsletterWelcomeTemplate,
  getNewsletterTemplate,
  getUnsubscribeConfirmationTemplate,
} = require("../utils/emailTemplates");

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res) => {
  try {
    const { email, name, preferences } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return res.status(400).json({ message: "You are already subscribed!" });
      }

      // Reactivate unsubscribed user
      existingSubscriber.status = "active";
      existingSubscriber.unsubscribedAt = null;
      existingSubscriber.name = name || existingSubscriber.name;
      existingSubscriber.subscribedAt = new Date();
      if (preferences) {
        existingSubscriber.preferences = { ...existingSubscriber.preferences, ...preferences };
      }
      await existingSubscriber.save();

      // Send welcome back email
      try {
        await sendEmail({
          email: existingSubscriber.email,
          subject: "Welcome Back to NI-IT Club Newsletter! 🎉",
          html: getNewsletterWelcomeTemplate(existingSubscriber.name || "Friend", true),
        });
      } catch (emailError) {
        console.error("Welcome email error:", emailError.message);
      }

      return res.status(200).json({
        message: "Welcome back! You have been resubscribed.",
        subscriber: {
          email: existingSubscriber.email,
          name: existingSubscriber.name,
        },
      });
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      name: name || "",
      preferences: preferences || {},
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      source: "website",
    });

    // Send welcome email
    try {
      await sendEmail({
        email: subscriber.email,
        subject: "Welcome to NI-IT Club Newsletter! 🚀",
        html: getNewsletterWelcomeTemplate(subscriber.name || "Friend", false),
      });
    } catch (emailError) {
      console.error("Welcome email error:", emailError.message);
    }

    res.status(201).json({
      message: "Successfully subscribed to the newsletter!",
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This email is already subscribed" });
    }
    console.error("Subscribe error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
const unsubscribe = async (req, res) => {
  try {
    const { token, email } = req.body;

    let subscriber;

    if (token) {
      subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    } else if (email) {
      subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    }

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    if (subscriber.status === "unsubscribed") {
      return res.status(400).json({ message: "You are already unsubscribed" });
    }

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    // Send confirmation email
    try {
      await sendEmail({
        email: subscriber.email,
        subject: "You've Been Unsubscribed from NI-IT Club",
        html: getUnsubscribeConfirmationTemplate(subscriber.name || "Friend"),
      });
    } catch (emailError) {
      console.error("Unsubscribe confirmation email error:", emailError.message);
    }

    res.json({
      message: "Successfully unsubscribed from the newsletter",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unsubscribe page data (verify token)
// @route   GET /api/newsletter/unsubscribe/:token
// @access  Public
const getUnsubscribeInfo = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return res.status(404).json({ message: "Invalid unsubscribe link" });
    }

    res.json({
      email: subscriber.email,
      name: subscriber.name,
      status: subscriber.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
const getSubscribers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const subscribers = await Subscriber.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Subscriber.countDocuments(filter);

    res.json({
      subscribers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subscriber stats
// @route   GET /api/newsletter/stats
// @access  Private/Admin
const getSubscriberStats = async (req, res) => {
  try {
    const stats = await Subscriber.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add subscriber (admin)
// @route   POST /api/newsletter/subscribers
// @access  Private/Admin
const addSubscriber = async (req, res) => {
  try {
    const { email, name, status = "active", preferences } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      name: name || "",
      status,
      preferences: preferences || {},
      source: "admin",
    });

    res.status(201).json({
      message: "Subscriber added successfully",
      subscriber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update subscriber
// @route   PUT /api/newsletter/subscribers/:id
// @access  Private/Admin
const updateSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, preferences } = req.body;

    const subscriber = await Subscriber.findById(id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    if (name !== undefined) subscriber.name = name;
    if (status) subscriber.status = status;
    if (preferences) subscriber.preferences = { ...subscriber.preferences, ...preferences };

    if (status === "unsubscribed" && subscriber.status !== "unsubscribed") {
      subscriber.unsubscribedAt = new Date();
    }

    await subscriber.save();

    res.json({
      message: "Subscriber updated successfully",
      subscriber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/newsletter/subscribers/:id
// @access  Private/Admin
const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send newsletter to subscribers
// @route   POST /api/newsletter/send
// @access  Private/Admin
const sendNewsletter = async (req, res) => {
  try {
    const { subject, content, preheader, category } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ message: "Subject and content are required" });
    }

    // Get active subscribers based on category preference
    const filter = { status: "active" };
    if (category && category !== "all") {
      filter[`preferences.${category}`] = true;
    }

    const subscribers = await Subscriber.find(filter).select("email name");

    if (subscribers.length === 0) {
      return res.status(400).json({ message: "No active subscribers found" });
    }

    const results = {
      total: subscribers.length,
      sent: 0,
      failed: 0,
      errors: [],
    };

    // Send emails in batches to avoid rate limiting
    const batchSize = 10;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const emailPromises = batch.map(async (subscriber) => {
        try {
          const unsubscribeUrl = `${process.env.CLIENT_URL}/unsubscribe?token=${subscriber.unsubscribeToken || ""}`;
          
          await sendEmail({
            email: subscriber.email,
            subject,
            html: getNewsletterTemplate({
              content,
              preheader: preheader || "",
              subscriberName: subscriber.name || "Friend",
              unsubscribeUrl,
            }),
          });

          // Update subscriber stats
          await Subscriber.findByIdAndUpdate(subscriber._id, {
            lastEmailSentAt: new Date(),
            $inc: { emailsSentCount: 1 },
          });

          results.sent++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            email: subscriber.email,
            error: error.message,
          });
        }
      });

      await Promise.all(emailPromises);

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < subscribers.length) {
        await delay(1000);
      }
    }

    res.json({
      message: `Newsletter sent to ${results.sent} subscribers`,
      results,
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export subscribers as CSV
// @route   GET /api/newsletter/export
// @access  Private/Admin
const exportSubscribers = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const subscribers = await Subscriber.find(filter)
      .select("email name status subscribedAt unsubscribedAt source preferences")
      .sort({ createdAt: -1 })
      .lean();

    // Generate CSV
    const headers = [
      "Email",
      "Name",
      "Status",
      "Subscribed At",
      "Unsubscribed At",
      "Source",
      "Events",
      "Projects",
      "Digest",
      "Announcements",
    ];

    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || "",
      sub.status,
      sub.subscribedAt ? new Date(sub.subscribedAt).toISOString() : "",
      sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toISOString() : "",
      sub.source,
      sub.preferences?.events ? "Yes" : "No",
      sub.preferences?.projects ? "Yes" : "No",
      sub.preferences?.digest ? "Yes" : "No",
      sub.preferences?.announcements ? "Yes" : "No",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=subscribers-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getUnsubscribeInfo,
  getSubscribers,
  getSubscriberStats,
  addSubscriber,
  updateSubscriber,
  deleteSubscriber,
  sendNewsletter,
  exportSubscribers,
};
