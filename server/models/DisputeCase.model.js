const { Schema, model, Types } = require("mongoose");

const DISPUTE_STATUS = ["OPEN", "RESOLVED", "CLOSED"];

const DisputeCaseSchema = new Schema(
  {
    bookingId: { type: Types.ObjectId, ref: "Booking", required: true, index: true },
    openedBy: { type: Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: DISPUTE_STATUS, default: "OPEN" },
    details: String
  },
  { timestamps: true }
);

module.exports = model("DisputeCase", DisputeCaseSchema);