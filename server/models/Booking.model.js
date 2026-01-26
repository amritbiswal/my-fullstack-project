const { Schema, model, Types } = require("mongoose");

const BOOKING_STATUS = [
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "HANDOFF_VERIFIED",
  "IN_USE",
  "RETURN_PENDING_VERIFICATION",
  "RETURN_VERIFIED",
  "CLOSED",
  "CANCELLED",
  "REJECTED",
  "DISPUTE_OPEN"
];

const BookingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: BOOKING_STATUS, default: "PENDING_CONFIRMATION", index: true },
    depositHeld: { type: Boolean, default: false },
    lineItems: [{ type: Types.ObjectId, ref: "BookingLineItem" }]
  },
  { timestamps: true }
);

module.exports = model("Booking", BookingSchema);