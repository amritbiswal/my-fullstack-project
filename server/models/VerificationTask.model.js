const { Schema, model, Types } = require("mongoose");

const VERIFICATION_STATUS = ["PENDING", "COMPLETED", "FAILED"];

const VerificationTaskSchema = new Schema(
  {
    unitId: { type: Types.ObjectId, ref: "InventoryUnit", required: true, index: true },
    assignedTo: { type: Types.ObjectId, ref: "User" },
    status: { type: String, enum: VERIFICATION_STATUS, default: "PENDING" },
    checklist: [String]
  },
  { timestamps: true }
);

module.exports = model("VerificationTask", VerificationTaskSchema);