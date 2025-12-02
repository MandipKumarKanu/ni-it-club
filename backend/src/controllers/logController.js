const ActivityLog = require("../models/ActivityLog");

const logActivity = async (userId, action, module, details, req = null) => {
  try {
    const user = req?.user || null;

    await ActivityLog.create({
      user: userId || user?._id || null,
      userName: user?.name || "System",
      userEmail: user?.email || null,
      userRole: user?.role || "system",
      action,
      module,
      details,
      ipAddress: req?.ip || req?.headers?.["x-forwarded-for"] || "System",
      method: req?.method || "SYSTEM",
      url: req?.originalUrl || "N/A",
      statusCode: 200,
      responseTime: 0,
      userAgent: req?.headers?.["user-agent"] || "System",
    });
  } catch (error) {
    console.error("Manual Activity Logging Error:", error.message);
  }
};

// @desc    Get all activity logs
// @route   GET /api/users/logs/activity
// @access  Private/Admin
const getLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      module,
      action,
      userId,
      startDate,
      endDate,
      search,
    } = req.query;

    const filter = {};

    if (module) filter.module = module;

    if (action) filter.action = action;

    if (userId) filter.user = userId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } },
        { url: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

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
    console.error("Get Logs Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get log statistics
// @route   GET /api/users/logs/stats
// @access  Private/Admin
const getLogStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    // Get counts by action
    const actionStats = await ActivityLog.aggregate([
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const moduleStats = await ActivityLog.aggregate([
      { $group: { _id: "$module", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const todayCount = await ActivityLog.countDocuments({
      createdAt: { $gte: today },
    });
    const weekCount = await ActivityLog.countDocuments({
      createdAt: { $gte: thisWeek },
    });

    const activeUsers = await ActivityLog.aggregate([
      { $match: { user: { $ne: null } } },
      {
        $group: {
          _id: "$user",
          userName: { $first: "$userName" },
          userEmail: { $first: "$userEmail" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const recentErrors = await ActivityLog.find({ statusCode: { $gte: 400 } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      actionStats: actionStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      moduleStats: moduleStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      todayCount,
      weekCount,
      activeUsers,
      recentErrors,
    });
  } catch (error) {
    console.error("Get Log Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete old logs
// @route   DELETE /api/users/logs/cleanup
// @access  Private/Admin
const cleanupLogs = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    res.json({
      message: `Deleted ${result.deletedCount} logs older than ${days} days`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Cleanup Logs Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLogs,
  getLogStats,
  cleanupLogs,
  logActivity,
};
