const { Schema, model, Types } = require("mongoose");

const InventoryUnitSchema = new Schema(
  {
    providerId: {
      type: Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
    },
    ownerUserId: { type: Types.ObjectId, ref: "User", required: true },
    skuId: { type: Types.ObjectId, ref: "PlatformSKU", required: true },
    cityId: { type: Types.ObjectId, ref: "City", required: true },
    zoneId: { type: Types.ObjectId, ref: "Zone" },
    title: { type: String },
    photos: [{ type: String }],
    condition: { type: String, enum: ["NEW", "EXCELLENT", "GOOD", "FAIR"] },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "PENDING_VERIFICATION",
        "ACTIVE",
        "RESERVED",
        "IN_USE",
        "BLOCKED",
        "RETIRED",
      ],
      default: "DRAFT",
    },
    verification: {
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      verifiedBy: { type: Types.ObjectId, ref: "User" },
    },
    deliveryOptions: {
      pickup: { type: Boolean, default: true },
      providerDelivery: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

InventoryUnitSchema.index({ providerId: 1, skuId: 1 });
InventoryUnitSchema.index({ cityId: 1, skuId: 1, status: 1 });

module.exports = model("InventoryUnit", InventoryUnitSchema);
