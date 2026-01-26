const { Schema, model, Types } = require("mongoose");

const PlatformSKUSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    pricePerDay: { type: Number, required: true },
    depositAmount: { type: Number, default: 0 },
    transactionMode: { type: String, enum: ["MANAGED_RENTAL", "VERIFIED_ONLY"], required: true },
    verificationRequired: { type: Boolean, default: true },
    deliveryAllowed: { type: Boolean, default: true },
    allowedCityIds: [{ type: Types.ObjectId, ref: "City" }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// PlatformSKUSchema.index({ slug: 1 }, { unique: true });
PlatformSKUSchema.index({ categoryId: 1 });
PlatformSKUSchema.index({ allowedCityIds: 1 });

module.exports = model("PlatformSKU", PlatformSKUSchema);