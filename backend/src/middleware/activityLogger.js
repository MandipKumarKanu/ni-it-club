const ActivityLog = require("../models/ActivityLog");

const getActionType = (method, url, statusCode) => {
  if (url.includes("/auth/login") && method === "POST") return "LOGIN";
  if (url.includes("/auth/logout") && method === "POST") return "LOGOUT";
  if (url.includes("/auth/register") && method === "POST") return "REGISTER";
  if (url.includes("/register") && method === "POST") return "EVENT_REGISTER";

  const actionMap = {
    POST: "CREATE",
    PUT: "UPDATE",
    PATCH: "UPDATE",
    DELETE: "DELETE",
    GET: "VIEW",
  };

  return actionMap[method] || method;
};

const getModuleName = (baseUrl, url) => {
  if (url.includes("/auth")) return "Auth";
  if (url.includes("/users")) return "Users";
  if (url.includes("/events")) return "Events";
  if (url.includes("/gallery")) return "Gallery";
  if (url.includes("/projects")) return "Projects";
  if (url.includes("/team")) return "Team";
  if (url.includes("/contact")) return "Contact";
  if (url.includes("/settings")) return "Settings";
  if (url.includes("/home")) return "Home";
  return baseUrl?.replace("/api/", "") || "Unknown";
};

const getResourceDetails = (req, res) => {
  const { method, body, params } = req;
  const statusCode = res.statusCode;
  let details = `Status: ${statusCode}`;

  if (params.id) {
    details += ` | Resource ID: ${params.id}`;
  }

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    const identifier = body.name || body.title || body.email || body.subject;
    if (identifier) {
      details += ` | ${
        method === "POST" ? "Created" : "Updated"
      }: "${identifier}"`;
    }
  }

  if (method === "DELETE") {
    details += " | Resource deleted";
  }

  if (statusCode >= 400) {
    details += " | Failed";
  }

  return details;
};

const excludedRoutes = ["/api/auth/refresh", "/favicon.ico", "/health"];

const publicLogRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/contact",
];

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const activityLogger = (req, res, next) => {
  const startTime = Date.now();

  if (
    !req.user &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.softAuthUserId = decoded.id;
    } catch (error) {}
  }

  res.on("finish", async () => {
    try {
      const url = req.originalUrl.split("?")[0];

      if (excludedRoutes.some((route) => url.includes(route))) {
        return;
      }

      if (req.method === "OPTIONS") {
        return;
      }

      const isPublicLogRoute = publicLogRoutes.some((route) =>
        url.startsWith(route)
      );

      const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
        req.method
      );

      let user = req.user;
      if (!user && req.softAuthUserId) {
        try {
          user = await User.findById(req.softAuthUserId).select(
            "name email role"
          );
        } catch (err) {}
      }

      if (!user && !isPublicLogRoute && !isMutation) {
        return;
      }

      const responseTime = Date.now() - startTime;
      const actionType = getActionType(req.method, url, res.statusCode);
      const moduleName = getModuleName(req.baseUrl, url);

      const logData = {
        user: user?._id || null,
        userName:
          user?.name ||
          (isPublicLogRoute ? req.body?.name : null) ||
          "Anonymous",
        userEmail:
          user?.email || (isPublicLogRoute ? req.body?.email : null) || null,
        userRole: user?.role || "guest",
        action: actionType,
        module: moduleName,
        details: getResourceDetails(req, res),
        ipAddress:
          req.ip ||
          req.headers["x-forwarded-for"] ||
          req.connection?.remoteAddress ||
          "Unknown",
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: responseTime,
        userAgent: req.headers["user-agent"] || null,
      };

      await ActivityLog.create(logData);
    } catch (error) {
      console.error("Activity Logging Error:", error.message, error.stack);
    }
  });

  next();
};

module.exports = activityLogger;
