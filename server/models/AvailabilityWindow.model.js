const { Schema, model, Types } = require("mongoose");

const AvailabilityWindowSchema = new Schema(
  {
    unitId: { type: Types.ObjectId, ref: "InventoryUnit", required: true, index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    note: { type: String },
  },
  { timestamps: true }
);

// AvailabilityWindowSchema.index({ unitId: 1, startDate: 1, endDate: 1 });

module.exports = model("AvailabilityWindow", AvailabilityWindowSchema);