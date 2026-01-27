const { Schema, model, Types } = require("mongoose");

const BookingLineItemSchema = new Schema({
  bookingId: { type: Types.ObjectId, ref: "Booking", required: true, index: true },
  skuId: { type: Types.ObjectId, ref: "PlatformSKU", required: true },
  quantity: { type: Number, default: 1 },
  allocatedUnitId: { type: Types.ObjectId, ref: "InventoryUnit" },
  snapshot: {
    pricePerDay: Number,
    days: Number,
    lineTotal: Number
  }
}, { timestamps: true });

module.exports = model("BookingLineItem", BookingLineItemSchema);