const { Schema, model, Types } = require("mongoose");

const MessageSchema = new Schema(
  {
    conversationId: { type: Types.ObjectId, ref: "Conversation", required: true, index: true },
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = model("Message", MessageSchema);