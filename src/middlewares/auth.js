const jwt = require("jsonwebtoken");
const Constants = require("../constants/constants");
const User = require("../models/user");
const userAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies[Constants.TOKEN];
    if (!token) {
      throw new Error("Access Denied");
    }
    const decodedToken = jwt.verify(token, Constants.JWT_SECRET_KEY);
    const { _id: userId } = decodedToken;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Token not valid");
    }
    req.loggedInUser = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

module.exports = {
  userAuthentication,
};
