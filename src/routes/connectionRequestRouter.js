const express = require("express");
const router = express.Router();
const SchemaEnums = require("../constants/schema-values.enum");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const BlockList = require("../models/blockList");
const ApiResponse = require("../utils/APIResponse");
const APIError = require("../utils/APIError");

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
router.post("/send/ignored/:toUserId", async (req, res) => {
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
      status: SchemaEnums.ConnectionStatus.IGNORE,
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

// Route for accepting a review request
router.post("/review/accepted/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentLoggedInUser = req.loggedInUser;

    // 1. Check if request exists and belongs to the logged-in user
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: currentLoggedInUser._id,
    });

    if (!connectionRequest) {
      throw new Error("Request not found or does not belong to you.");
    }

    // 2. Ensure the request is in "interested" (Pending) state
    if (connectionRequest.status !== SchemaEnums.ConnectionStatus.INTERESTED) {
      throw new Error("Only pending (interested) requests can be accepted.");
    }

    // 3.Accept the Connection request ie. Update request status to "accepted"
    connectionRequest.status = SchemaEnums.ConnectionStatus.ACCEPTED;
    const connectionData = await connectionRequest.save();

    res.status(200).json({
      message: "Request accepted successfully.",
      data: connectionData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route for rejecting a review request
router.post("/review/rejected/:requestId", (req, res) => {
  const { requestId } = req.params;
  res.status(200).json({
    message: `❌ Request ${requestId} rejected`,
  });
});

//Route to block a use
router.post("/block/:toUserId", async (req, res, next) => {
  try {
    const { toUserId } = req.params;
    const user = req.loggedInUser;
    const fromUserId = user._id;

    // Check if recipient user exists
    const recipientUserExist = await User.isValidUser(toUserId);
    if (!recipientUserExist) {
      throw new APIError(404, "User not found");
    }

    // Check if blocking self
    if (fromUserId.equals(toUserId)) {
      throw new APIError(400, "You cannot block yourself");
    }

    // Check if user is already blocked
    const isAlreadyBlocked = await BlockList.exists({
      $or: [
        { blockedByUserId: fromUserId, blockedUserId: toUserId },
        { blockedByUserId: toUserId, blockedUserId: fromUserId },
      ],
    });

    if (isAlreadyBlocked) {
      throw new APIError(400, "User already blocked");
    }

    // Block the user
    const blocked = new BlockList({
      blockedByUserId: fromUserId,
      blockedUserId: toUserId,
    });

    await blocked.save();
    const blockedUser = await User.findById(toUserId);

    const successResponse = new ApiResponse(
      `✅ You have successfully blocked ${blockedUser.firstName}`,
      201
    ).toJSON();

    res.status(201).json(successResponse);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
