const { Schema, model, Types } = require("mongoose");

const VERIFICATION_TYPES = ["UNIT_ONBOARDING", "PRE_HANDOFF", "POST_RETURN"];
const VERIFICATION_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const VerificationTaskSchema = new Schema(
  {
    type: { type: String, enum: VERIFICATION_TYPES, required: true },
    unitId: { type: Types.ObjectId, ref: "InventoryUnit", required: true },
    bookingId: { type: Types.ObjectId, ref: "Booking" },
    providerId: { type: Types.ObjectId, ref: "ProviderProfile", required: true },
    cityId: { type: Types.ObjectId, ref: "City", required: true },
    status: { type: String, enum: VERIFICATION_STATUSES, default: "PENDING" },
    assignedToUserId: { type: Types.ObjectId, ref: "User" },
    priority: { type: String, enum: PRIORITIES, default: "MEDIUM" },
    notes: { type: String }
  },
  { timestamps: true }
);

VerificationTaskSchema.index({ status: 1, cityId: 1, type: 1 });
VerificationTaskSchema.index({ unitId: 1, type: 1, status: 1 });

module.exports = model("VerificationTask", VerificationTaskSchema);