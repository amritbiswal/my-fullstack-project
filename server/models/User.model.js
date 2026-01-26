const { Schema, model, Types } = require("mongoose");

const USER_ROLES = [
  "TOURIST",
  "PROVIDER_INDIVIDUAL",
  "PROVIDER_BUSINESS",
  "STAFF_VERIFIER",
  "PARTNER",
  "DELIVERY_PARTNER",
  "ADMIN",
];

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    providerProfile: { type: Types.ObjectId, ref: "ProviderProfile" },
  },
  { timestamps: true },
);

module.exports = model("User", UserSchema);
