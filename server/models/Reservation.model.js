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

const ReservationSchema = new Schema(
  {
    bookingLineItemId: { type: Types.ObjectId, ref: "BookingLineItem", required: true, index: true },
    status: { type: String, enum: BOOKING_STATUS, default: "PENDING_CONFIRMATION" }
  },
  { timestamps: true }
);

module.exports = model("Reservation", ReservationSchema);