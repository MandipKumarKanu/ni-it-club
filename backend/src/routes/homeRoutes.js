const express = require("express");
const router = express.Router();
const { getHomeData } = require("../controllers/homeController");

// Public route
router.get("/", getHomeData);

module.exports = router;
    