const { Schema, model, Types } = require("mongoose");

const ZoneSchema = new Schema(
  {
    cityId: { type: Types.ObjectId, ref: "City", required: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ZoneSchema.index({ cityId: 1, name: 1 }, { unique: true });

module.exports = model("Zone", ZoneSchema);