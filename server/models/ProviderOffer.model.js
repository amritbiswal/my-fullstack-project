const { Schema, model, Types } = require("mongoose");

const OFFER_STATUS = ["PENDING", "ACCEPTED", "REJECTED"];

const ProviderOfferSchema = new Schema(
  {
    sourcingRequestId: { type: Types.ObjectId, ref: "SourcingRequest", required: true, index: true },
    providerId: { type: Types.ObjectId, ref: "ProviderProfile", required: true },
    unitId: { type: Types.ObjectId, ref: "InventoryUnit" },
    price: Number,
    status: { type: String, enum: OFFER_STATUS, default: "PENDING" }
  },
  { timestamps: true }
);

module.exports = model("ProviderOffer", ProviderOfferSchema);