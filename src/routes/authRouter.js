const express = require("express");
const router = express.Router();
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Constants = require("../constants/constants");
const ApiResponse = require("../utils/APIResponse");
const APIError = require("../utils/APIError");

router.post("/signup", async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      password,
      bio,
      interests,
      languages,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !age || !gender) {
      throw new APIError(403, "All Fields are required");
    }
    if (!validator.isStrongPassword(password)) {
      throw new APIError(403, "Password is too weak");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError(403, `User with email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: hashedPassword,
      bio: bio || "",
      interests: Array.isArray(interests) ? interests : [],
      languages: Array.isArray(languages) ? languages : [],
    });
    const successResponse = new ApiResponse(
      "Account Created Successfully 🚀🚀",
      201,
      user
    ).toJSON();

    res.status(201).json(successResponse);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User with email ${email} does not exist`);
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    // Generate a JWT token using the user's ID as payload
    //const token = jwt.sign({ _id: user._id }, Constants.JWT_SECRET_KEY);
    const token = user.generateToken();

    // Set the token as cookie and send it with response
    res.cookie(Constants.TOKEN, token);
    res.status(200).json({
      message: `Welcome ${user.firstName} ${user.lastName}!`,
      success: true,
    });
  } catch (err) {
    console.error(err.message); // Log the error for debugging

    res.status(500).json({
      error: err.message || "Internal Server Error",
      success: false,
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(Constants.TOKEN);
  res.status(200).json({ message: "User Logged Out 🚀🚀" });
});

module.exports = router;
