const mongoose = require("mongoose");
const blockListSchema = new mongoose.Schema(
  {
    blockedByUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    blockedUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const blockListModel = mongoose.model("BlockList", blockListSchema);
module.exports = blockListModel;
