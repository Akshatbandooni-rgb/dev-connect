const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateProfileEditData } = require("../utils/validation");
const router = express.Router();
const ApiResponse = require("../utils/APIResponse");
const APIError = require("../utils/APIError");

// Route to view user profile
router.get("/view", (req, res, next) => {
  try {
    const user = req.loggedInUser;

    const successResponse = new ApiResponse(
      "👤 User profile fetched successfully",
      200,
      { user }
    ).toJSON();

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
});

// Route to edit user profile
router.patch("/edit", async (req, res, next) => {
  try {
    const dataToUpdate = req.body;
    const user = req.loggedInUser;

    if (!validateProfileEditData(dataToUpdate)) {
      throw new APIError(400, "Invalid fields detected in profile update");
    }

    Object.assign(user, dataToUpdate);
    await user.save();

    const successResponse = new ApiResponse(
      "✅ User profile updated successfully!",
      200,
      { user }
    ).toJSON();

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
});

// Route to change user password
router.patch("/password", async (req, res, next) => {
  try {
    const user = req.loggedInUser;
    const { password: updatedPassword } = req.body;

    if (!validator.isStrongPassword(updatedPassword)) {
      throw new APIError(400, "Password is too weak");
    }

    const isSameAsOldPassword = await user.comparePassword(updatedPassword);
    if (isSameAsOldPassword) {
      throw new APIError(
        400,
        "New password cannot be the same as the old password"
      );
    }

    user.password = await bcrypt.hash(updatedPassword, 10);
    await user.save();

    const successResponse = new ApiResponse(
      "✅ Password updated successfully!",
      200
    ).toJSON();

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
});

// Export the router to be used in the main app
module.exports = router;
