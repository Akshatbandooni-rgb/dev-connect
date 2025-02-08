const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateProfileEditData } = require("../utils/validation");
const router = express.Router();

// Route to view user profile information (GET request)
router.get("/view", (req, res) => {
  try {
    const user = req.loggedInUser;
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to edit user profile information (PATCH request)
router.patch("/edit", async (req, res) => {
  try {
    const dataToUpdate = req.body;
    const user = req.loggedInUser;

    const isEditAllowed = validateProfileEditData(dataToUpdate);
    if (!isEditAllowed) {
      throw new Error(
        "❌Profile edit is not allowed. Invalid fields detected!"
      );
    }

    for (const field of Object.keys(dataToUpdate)) {
      user[field] = dataToUpdate[field];
    }
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "✅ User profile updated successfully! Changes are now reflected.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error.message || "⚠️ Unable to update profile. Please try again later.",
    });
  }
});


// Route to change user password (PATCH request)
router.patch("/password", async (req, res) => {
  try {
    //  1. Enforce a Strong Password Policy
    //  2. Prevent Reusing the Same Password
    //  3. Hash the New Password Before Storing

    const user = req.loggedInUser;
    const { password: updatedPassword } = req.body;

    const isWeakPassword = !validator.isStrongPassword(updatedPassword);
    const isSameAsOldPassword = await user.comparePassword(updatedPassword);

    if (isWeakPassword) {
      throw new Error("❌ Password is too weak");
    }

    if (isSameAsOldPassword) {
      throw new Error("❌ New password cannot be the same as the old password");
    }

    const hashedPassword = await bcrypt.hash(updatedPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "✅ Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
});


// Export the router to be used in the main app
module.exports = router;
