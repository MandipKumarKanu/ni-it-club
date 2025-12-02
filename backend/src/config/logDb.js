const mongoose = require("mongoose");

let logDbConnection = null;

const getLogDbConnection = () => {
  if (logDbConnection && logDbConnection.readyState === 1) {
    return logDbConnection;
  }

  // Fall back to main database if log database URI is not configured
  const logDbUri = process.env.MONGODB_URI_LOG || process.env.MONGODB_URI;
  
  if (!logDbUri) {
    console.warn("No MongoDB URI configured for logs");
    return null;
  }

  logDbConnection = mongoose.createConnection(logDbUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  logDbConnection.on("connected", () => {
    console.log("MongoDB Log Database Connected");
  });

  logDbConnection.on("error", (err) => {
    console.error(`MongoDB Log Database Connection Error: ${err.message}`);
  });

  logDbConnection.on("disconnected", () => {
    console.log("MongoDB Log Database Disconnected");
    logDbConnection = null;
  });

  return logDbConnection;
};

module.exports = getLogDbConnection();
