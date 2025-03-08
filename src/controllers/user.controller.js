const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user"); 
const BlockList = require("../models/blockList"); 
const SchemaEnums = require("../constants/schema-values.enum");
const ApiResponse = require("../utils/APIResponse");

const getUserConnection = async (req, res, next) => {
  try {
    const currentLoggedInUser = req.loggedInUser;

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

    const successResponse = new ApiResponse(
      "🔗 User connections fetched successfully",
      200,
      { connections }
    ).toJSON();

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
};

const getUserRequests = async (req, res, next) => {
  try {
    const currentLoggedInUser = req.loggedInUser;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: currentLoggedInUser._id,
      status: SchemaEnums.ConnectionStatus.INTERESTED,
    })
      .populate("fromUserId", "firstName lastName age gender")
      .lean();

    const successResponse = new ApiResponse(
      "📥 User requests fetched successfully",
      200,
      { requests: connectionRequests }
    ).toJSON();

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
};

const getUserFeed = async (req, res, next) => {
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

    // Fetch the feed (excluding the above users)
    const userList = await User.find({ _id: { $nin: excludeUsers } }).select(
      "firstName lastName age gender bio interests languages"
    );

    const successResponse = new ApiResponse(
      "📰 User feed fetched successfully",
      200,
      { users: userList, total: userList.length }
    ).toJSON();

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getUserConnection,
  getUserRequests,
  getUserFeed,
};
