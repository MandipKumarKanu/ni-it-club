const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

if (process.env.NODE_ENV !== "production") {
  connectDB();
}

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      process.env.CLIENT_URL,
      "https://ni-itclub.web.app",
      "https://ni-it-club-c6lq.vercel.app",
      "https://ni-it-club-admin.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(require("./middleware/activityLogger"));

app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/tips", require("./routes/tipRoutes"));
app.use("/api/traffic", require("./routes/trafficRoutes"));

app.get("/", (req, res) => {
  res.redirect(process.env.CLIENT_URL || "https://ni-itclub.web.app");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Database health check endpoint
app.get("/dbhealth", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    if (dbState === 1) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
      res.json({
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: "error",
        database: states[dbState] || "unknown",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
