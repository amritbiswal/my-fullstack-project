const { Schema, model, Types } = require("mongoose");

const SourcingRequestSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    cityId: { type: Types.ObjectId, ref: "City", required: true },
    name: { type: String, required: true }, // requested item name
    description: String,
    status: { type: String, enum: ["OPEN", "APPROVED", "REJECTED"], default: "OPEN" },
    offers: [{ type: Types.ObjectId, ref: "SourcingDecision" }],
  },
  { timestamps: true }
);

module.exports = model("SourcingRequest", SourcingRequestSchema);