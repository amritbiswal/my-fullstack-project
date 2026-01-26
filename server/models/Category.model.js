const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// CategorySchema.index({ slug: 1 }, { unique: true });

module.exports = model("Category", CategorySchema);