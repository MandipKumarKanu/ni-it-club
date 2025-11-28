const app = require("../src/app");
const connectDB = require("../src/config/db");

// Serverless function handler
module.exports = async (req, res) => {
  // Ensure database connection
  await connectDB();

  // Handle the request with Express app
  return app(req, res);
};
