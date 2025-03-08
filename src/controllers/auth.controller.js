const APIError = require("../utils/APIError");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const ApiResponse = require("../utils/APIResponse");
const Constants = require("../constants/constants");

const signupUser = async (req, res, next) => {
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
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new APIError(403, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new APIError(404, `User with email ${email} does not exist`);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new APIError(401, "Invalid Credentials");
    }

    const token = user.generateToken();

    res.cookie(Constants.TOKEN, token);

    const successResponse = new ApiResponse(
      `Welcome ${user.firstName} ${user.lastName}!`,
      200,
      { token }
    ).toJSON();

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie(Constants.TOKEN);
  const successResponse = new ApiResponse(
    "User Logged Out Successfully 🚀🚀",
    200
  ).toJSON();

  res.status(200).json(successResponse);
};
module.exports = {
  signupUser,
  loginUser,
  logoutUser,
};
