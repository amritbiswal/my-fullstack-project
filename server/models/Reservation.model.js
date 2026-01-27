const { Schema, model, Types } = require("mongoose");

const ReservationSchema = new Schema({
  unitId: { type: Types.ObjectId, ref: "InventoryUnit", required: true },
  bookingId: { type: Types.ObjectId, ref: "Booking", required: true },
  startDate: { type: Date, required: true},
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["ACTIVE", "CANCELLED"], default: "ACTIVE" }
}, { timestamps: true });

ReservationSchema.index({ unitId: 1, startDate: 1, endDate: 1, status: 1 });

module.exports = model("Reservation", ReservationSchema);