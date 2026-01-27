const { Schema, model, Types } = require("mongoose");

const BOOKING_STATUSES = [
  "PENDING_CONFIRMATION", "CONFIRMED", "HANDOFF_VERIFIED", "IN_USE",
  "RETURN_PENDING_VERIFICATION", "RETURN_VERIFIED", "CLOSED", "CANCELLED", "REJECTED", "DISPUTE_OPEN"
];

const BookingSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
  cityId: { type: Types.ObjectId, ref: "City", required: true, index: true },
  zoneId: { type: Types.ObjectId, ref: "Zone" },
  transactionMode: { type: String, enum: ["MANAGED_RENTAL", "VERIFIED_ONLY"], required: true },
  status: { type: String, enum: BOOKING_STATUSES, default: "PENDING_CONFIRMATION" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  deliveryOption: { type: String, enum: ["PICKUP", "PROVIDER_DELIVERY", "PLATFORM_DELIVERY"] },
  deliveryAddress: { type: Object },
  pricing: {
    subtotal: Number,
    deposit: Number,
    fees: Number,
    total: Number
  }
}, { timestamps: true });

BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ cityId: 1, status: 1 });

module.exports = model("Booking", BookingSchema);