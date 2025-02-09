const mongoose = require("mongoose");
const SchemaEnums = require("../constants/schema-values.enum");

const connectionRequestSchema =new  mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: [
          SchemaEnums.ConnectionStatus.IGNORE,
          SchemaEnums.ConnectionStatus.INTERESTED,
          SchemaEnums.ConnectionStatus.ACCEPTED,
          SchemaEnums.ConnectionStatus.REJECTED,
        ],
        message: "{VALUE} is not a valid connection status",
      },
    },
  },
  { timestamps: true }
);

const connectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = connectionRequestModel;
