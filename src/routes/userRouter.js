const express = require("express");
const router = express.Router();
const {
  getUserConnection,
  getUserRequests,
  getUserFeed,
} = require("../controllers/user.controller");

// Route to fetch user connections
// Fetch user connections
router.get("/connections", getUserConnection);

// Fetch user requests
router.get("/requests", getUserRequests);

// Fetch user feed
router.get("/feed", getUserFeed);

module.exports = router;
