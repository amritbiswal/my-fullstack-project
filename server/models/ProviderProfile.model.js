const { Schema, model, Types } = require("mongoose");

const PROVIDER_TYPES = ["INDIVIDUAL", "BUSINESS"];
const ONBOARDING_STATUSES = ["DRAFT", "SUBMITTED", "ACTIVE", "SUSPENDED"];

const ProviderProfileSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    providerType: { type: String, enum: PROVIDER_TYPES, required: true },
    businessName: { type: String, required: function() { return this.providerType === "BUSINESS"; } },
    displayName: String,
    phone: String,
    email: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    service: {
      cityIds: [{ type: Types.ObjectId, ref: "City" }],
      zoneIds: [{ type: Types.ObjectId, ref: "Zone" }],
      radiusKm: Number,
    },
    onboardingStatus: { type: String, enum: ONBOARDING_STATUSES, default: "DRAFT" },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ProviderProfileSchema.index({ userId: 1 }, { unique: true });
ProviderProfileSchema.index({ "service.cityIds": 1 });

module.exports = model("ProviderProfile", ProviderProfileSchema);