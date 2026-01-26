const { Schema, model } = require("mongoose");

const CitySchema = new Schema(
  {
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model("City", CitySchema);