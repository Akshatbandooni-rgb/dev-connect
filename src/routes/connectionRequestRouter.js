const express = require("express");
const router = express.Router();
const SchemaEnums = require("../constants/schema-values.enum");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const BlockList = require("../models/blockList");

// Route for sending an 'interested' request to a user
router.post("/send/interested/:toUserId", async (req, res) => {
  try {
    const { toUserId } = req.params;
    const user = req.loggedInUser;
    const fromUserId = user._id;

    // Check if recipient user exists
    const recipientUserExist = await User.isValidUser(toUserId);
    if (!recipientUserExist) {
      throw new Error("User not found");
    }

    // Check if sending request to self
    const isSendingToSelf = user._id.equals(toUserId);
    if (isSendingToSelf) {
      throw new Error("You cannot send a request to yourself");
    }

    // Check if request already exists (Prevent duplicates)
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: fromUserId,
          toUserId: toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    if (existingRequest) {
      throw new Error("Interest request already sent");
    }

    // Check if user has blocked each other
    const isBlocked = await BlockList.exists({
      $or: [
        { blockedByUserId: fromUserId, blockedUserId: toUserId },
        { blockedByUserId: toUserId, blockedUserId: fromUserId },
      ],
    });
    if (isBlocked) {
      throw new Error(
        "You are unable to send a request to this user at this time"
      );
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status: SchemaEnums.ConnectionStatus.INTERESTED,
    });
    await connectionRequest.save();

    const recipientUser = await User.findById(toUserId);

    res.status(200).json({
      message: `📩 ${user.firstName} is interested in ${recipientUser.firstName}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for sending an 'ignored' request to a user
router.post("/send/ignored/:userId", (req, res) => {
  const { userId } = req.params;
  res.status(200).json({
    message: `🚫 Request ignored for user ${userId}`,
  });
});

// Route for accepting a review request
router.post("/review/accepted/:requestId", (req, res) => {
  const { requestId } = req.params;
  res.status(200).json({
    message: `✅ Request ${requestId} accepted`,
  });
});

// Route for rejecting a review request
router.post("/review/rejected/:requestId", (req, res) => {
  const { requestId } = req.params;
  res.status(200).json({
    message: `❌ Request ${requestId} rejected`,
  });
});

//Route to block a use
router.post("/block/:toUserId", async (req, res) => {
  try {
    const { toUserId } = req.params;
    const user = req.loggedInUser;
    const fromUserId = user._id;

    // Check if recipient user exists
    const recipientUserExist = await User.isValidUser(toUserId);
    if (!recipientUserExist) {
      throw new Error("User not found");
    }

    // Check if blocking self
    const isBlockingSelf = fromUserId.equals(toUserId);
    if (isBlockingSelf) {
      throw new Error("You cannot block yourself");
    }

    // Check if user is already blocked
    const isAlreadyBlocked = await BlockList.exists({
      $or: [
        { blockedByUserId: fromUserId, blockedUserId: toUserId },
        { blockedByUserId: toUserId, blockedUserId: fromUserId },
      ],
    });

    if (isAlreadyBlocked) {
      throw new Error("User already blocked");
    }

    // Block the user
    const blocked = new BlockList({
      blockedByUserId: fromUserId,
      blockedUserId: toUserId,
    });

    await blocked.save();
    const blockedUser = await User.findById(toUserId);

    res.status(201).json({
      message: `You have successfuly blocked ${blockedUser.firstName}`,
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
