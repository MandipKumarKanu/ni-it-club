const PageView = require("../models/PageView");
const { getClientIP } = require("../utils/ipUtils");

const parseUserAgent = (userAgent) => {
  if (!userAgent) return { device: "unknown", browser: "" };

  const ua = userAgent.toLowerCase();

  let device = "desktop";
  if (
    /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
  ) {
    device = /ipad|tablet/i.test(ua) ? "tablet" : "mobile";
  }

  let browser = "Unknown";
  if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("edg")) browser = "Edge";
  else if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("safari")) browser = "Safari";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";

  return { device, browser };
};

exports.trackPageView = async (req, res) => {
  try {
    const { path, referrer, sessionId } = req.body;

    if (!path || !sessionId) {
      return res
        .status(400)
        .json({ message: "Path and sessionId are required" });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ip = getClientIP(req);
    const { device, browser } = parseUserAgent(userAgent);

    const pageView = new PageView({
      path,
      referrer: referrer || "",
      userAgent,
      ip,
      sessionId,
      device,
      browser,
    });

    await pageView.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    res.status(500).json({ message: "Failed to track page view" });
  }
};

exports.getTrafficStats = async (req, res) => {
  try {
    const { period = "7d" } = req.query;

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24);
        break;
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const totalViews = await PageView.countDocuments({
      createdAt: { $gte: startDate },
    });

    const uniqueVisitors = await PageView.distinct("sessionId", {
      createdAt: { $gte: startDate },
    });

    const pageStats = await PageView.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$path",
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$sessionId" },
        },
      },
      {
        $project: {
          path: "$_id",
          views: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    const viewsOverTime = await PageView.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === "24h" ? "%Y-%m-%d %H:00" : "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kathmandu",
            },
          },
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$sessionId" },
        },
      },
      {
        $project: {
          date: "$_id",
          views: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
        },
      },
      { $sort: { date: 1 } },
    ]);

    const deviceStats = await PageView.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
    ]);

    const browserStats = await PageView.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const referrerStats = await PageView.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          referrer: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const prevStartDate = new Date(startDate);
    const periodLength = now - startDate;
    prevStartDate.setTime(startDate.getTime() - periodLength);

    const prevTotalViews = await PageView.countDocuments({
      createdAt: { $gte: prevStartDate, $lt: startDate },
    });

    const prevUniqueVisitors = await PageView.distinct("sessionId", {
      createdAt: { $gte: prevStartDate, $lt: startDate },
    });

    const viewsChange = prevTotalViews
      ? (((totalViews - prevTotalViews) / prevTotalViews) * 100).toFixed(1)
      : 0;
    const visitorsChange = prevUniqueVisitors.length
      ? (
          ((uniqueVisitors.length - prevUniqueVisitors.length) /
            prevUniqueVisitors.length) *
          100
        ).toFixed(1)
      : 0;

    res.json({
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      viewsChange: Number(viewsChange),
      visitorsChange: Number(visitorsChange),
      pageStats,
      viewsOverTime,
      deviceStats,
      browserStats,
      referrerStats,
      period,
    });
  } catch (error) {
    console.error("Error getting traffic stats:", error);
    res.status(500).json({ message: "Failed to get traffic stats" });
  }
};

exports.getRealtimeVisitors = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const activeVisitors = await PageView.aggregate([
      { $match: { createdAt: { $gte: fiveMinutesAgo } } },
      {
        $group: {
          _id: "$sessionId",
          lastPage: { $last: "$path" },
          lastSeen: { $max: "$createdAt" },
        },
      },
    ]);

    const activePaths = await PageView.aggregate([
      { $match: { createdAt: { $gte: fiveMinutesAgo } } },
      {
        $group: {
          _id: "$path",
          visitors: { $addToSet: "$sessionId" },
        },
      },
      {
        $project: {
          path: "$_id",
          count: { $size: "$visitors" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      activeCount: activeVisitors.length,
      activeVisitors,
      activePaths,
    });
  } catch (error) {
    console.error("Error getting realtime visitors:", error);
    res.status(500).json({ message: "Failed to get realtime visitors" });
  }
};
