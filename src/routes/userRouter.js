const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Route to fetch user connections
router.get("/connections", (req, res) => {
  res.status(200).json({ message: "🔗 User connections fetched" });
});

// Route to fetch user requests
router.get("/requests", (req, res) => {
  res.status(200).json({ message: "📥 User requests fetched" });
});

// Route to fetch user feed
router.get("/feed", async (req, res) => {
  try {
    const loggedInUserId = req.loggedInUser._id;
    // Fetch all users and filter out the logged-in user
    let userList = await User.find();
    userList = userList.filter((user) => !user._id.equals(loggedInUserId));
    res.status(200).json({
      data: userList,
      total: userList.length,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});


module.exports = router;
