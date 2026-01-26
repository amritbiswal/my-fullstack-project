const { Schema, model, Types } = require("mongoose");

const BookingLineItemSchema = new Schema(
  {
    bookingId: { type: Types.ObjectId, ref: "Booking", required: true, index: true },
    unitId: { type: Types.ObjectId, ref: "InventoryUnit", required: true },
    startDate: Date,
    endDate: Date,
    price: Number
  },
  { timestamps: true }
);

module.exports = model("BookingLineItem", BookingLineItemSchema);