const { Schema, model, Types } = require("mongoose");

const DepositHoldSchema = new Schema(
  {
    bookingId: { type: Types.ObjectId, ref: "Booking", required: true, index: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["HELD", "RELEASED", "ADJUSTED"], default: "HELD" },
    notes: String,
    releasedAt: Date,
    adjustedBy: { type: Types.ObjectId, ref: "User" }, // admin user
    adjustmentAmount: Number,
    adjustmentNotes: String,
  },
  { timestamps: true }
);

module.exports = model("DepositHold", DepositHoldSchema);