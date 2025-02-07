const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Constants = require("../constants/constants");

// Route to view user profile information (GET request)
router.get("/view", (req, res) => {
  try {
    const { token } = req.cookies;
    const decodedToken = jwt.verify(token, Constants.JWT_SECRET_KEY);
    res.status(200).json({
      message: "📊 User Profile Information retrieved successfully!",
    });
  } catch (error) {
    res.status(400).json({message:error.message})
  }
});

// Route to edit user profile information (PATCH request)
router.patch("/edit", (req, res) => {
  res.status(200).json({
    message: "✅ User profile updated successfully!",
  });
});

// Route to change user password (PATCH request)
router.patch("/password", (req, res) => {
  res.status(200).json({
    message: "🔐 Password updated successfully!",
  });
});

// Export the router to be used in the main app
module.exports = router;
