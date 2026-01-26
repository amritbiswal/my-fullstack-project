const { Schema, model, Types } = require("mongoose");

const ConversationSchema = new Schema(
  {
    participants: [{ type: Types.ObjectId, ref: "User", required: true }]
  },
  { timestamps: true }
);

module.exports = model("Conversation", ConversationSchema);