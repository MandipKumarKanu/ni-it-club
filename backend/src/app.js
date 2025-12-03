const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
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
  res.send("NI-IT Club Backend is running!");
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
