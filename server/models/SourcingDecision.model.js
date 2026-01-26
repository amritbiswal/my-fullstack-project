const { Schema, model, Types } = require("mongoose");

const SourcingDecisionSchema = new Schema(
  {
    requestId: { type: Types.ObjectId, ref: "SourcingRequest", required: true, index: true },
    providerId: { type: Types.ObjectId, ref: "ProviderProfile", required: true },
    offerDetails: String,
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    adminNotes: String,
  },
  { timestamps: true }
);

module.exports = model("SourcingDecision", SourcingDecisionSchema);