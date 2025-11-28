const mongoose = require("mongoose");

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process in serverless environment, just log error
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
