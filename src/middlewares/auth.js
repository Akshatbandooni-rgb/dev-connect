const jwt = require("jsonwebtoken");
const Constants = require("../constants/constants");
const User = require("../models/user");

// Middleware to authenticate users
const userAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies[Constants.TOKEN]; // Get token from cookies
    if (!token) throw new Error("Access Denied");

    const decodedToken = jwt.verify(token, Constants.JWT_SECRET_KEY); // Verify token
    const user = await User.findById(decodedToken._id); // Fetch user

    if (!user) throw new Error("Token not valid");

    req.loggedInUser = user; // Attach user to request
    next();
  } catch (error) {
    res.status(403).json({ message: error.message }); // Handle errors
  }
};

module.exports = { userAuthentication };
