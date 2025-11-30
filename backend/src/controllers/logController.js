const ActivityLog = require("../models/ActivityLog");

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private/Admin
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, module, action, userId } = req.query;

    const filter = {};
    if (module) filter.module = module;
    if (action) filter.action = action;
    if (userId) filter.user = userId;

    const logs = await ActivityLog.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(filter);

    res.json({
      logs,
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

// Helper function to log activity
const logActivity = async (userId, action, module, details, req) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    await ActivityLog.create({
      user: userId,
      action,
      module,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

module.exports = {
  getLogs,
  logActivity,
};
