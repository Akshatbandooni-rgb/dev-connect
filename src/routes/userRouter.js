const express = require("express");
const router = express.Router();
const User = require("../models/user");
const BlockList = require("../models/blockList");
const ConnectionRequest = require("../models/connectionRequest");
const SchemaEnums = require("../constants/schema-values.enum");

// Route to fetch user connections
router.get("/connections", async (req, res) => {
  try {
    // Retrieve the logged-in user
    const currentLoggedInUser = req.loggedInUser;

    // Find allconnections of the user
    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: currentLoggedInUser._id,
          status: SchemaEnums.ConnectionStatus.ACCEPTED,
        },
        {
          toUserId: currentLoggedInUser._id,
          status: SchemaEnums.ConnectionStatus.ACCEPTED,
        },
      ],
    })
      .populate("fromUserId toUserId", "firstName lastName age gender")
      .lean();

    // Respond with the fetched connections
    res.status(200).json({
      message: "🔗 User connections fetched",
      connections,
    });
  } catch (error) {
    console.error("Error fetching user connections:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route to fetch user requests
router.get("/requests", async (req, res) => {
  try {
    // Retrieve the logged-in user
    const currentLoggedInUser = req.loggedInUser;

    // Fetch connection requests for the user with status "INTERESTED"
    const connectionRequests = await ConnectionRequest.find({
      toUserId: currentLoggedInUser._id,
      status: SchemaEnums.ConnectionStatus.INTERESTED,
    })
      .populate("fromUserId", "firstName lastName age gender") // Populate sender details
      .lean();

    // Respond with the fetched requests
    res.status(200).json({
      message: "📥 User requests fetched",
      requests: connectionRequests,
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route to fetch user feed
router.get("/feed", async (req, res) => {
  try {
    const loggedInUserId = req.loggedInUser._id;

    // Get blocked users (both ways)
    const blockedUsers = await BlockList.find({
      $or: [
        { blockedByUserId: loggedInUserId },
        { blockedUserId: loggedInUserId },
      ],
    }).distinct("blockedUserId");

    // Get users who are already connected (pending or accepted requests)
    const sentRequests = await ConnectionRequest.find({
      fromUserId: loggedInUserId,
      status: {
        $in: [
          SchemaEnums.ConnectionStatus.INTERESTED,
          SchemaEnums.ConnectionStatus.ACCEPTED,
        ],
      },
    }).distinct("toUserId");

    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: {
        $in: [
          SchemaEnums.ConnectionStatus.INTERESTED,
          SchemaEnums.ConnectionStatus.ACCEPTED,
        ],
      },
    }).distinct("fromUserId");

    const excludedConnections = [
      ...new Set([...sentRequests, ...receivedRequests]),
    ];

    // Combine all users to exclude (including the logged-in user)
    const excludeUsers = [
      ...blockedUsers,
      ...excludedConnections,
      loggedInUserId,
    ];

    //  Fetch the feed (excluding the above users)
    const userList = await User.find({ _id: { $nin: excludeUsers } }).select(
      "firstName lastName age gender bio interests languages"
    );

    res.status(200).json({
      data: userList,
      total: userList.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
