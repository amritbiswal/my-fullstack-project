const { Schema, model, Types } = require("mongoose");

const NotificationSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    payload: Schema.Types.Mixed,
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = model("Notification", NotificationSchema);