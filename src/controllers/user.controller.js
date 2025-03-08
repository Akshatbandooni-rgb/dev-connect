const ConnectionRequest = require("../models/connectionRequest");
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

module.exports = {
  getUserConnection,
};
