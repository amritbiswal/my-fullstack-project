const Category = require("../../models/Category.model");
const ApiError = require("../../error-handling/ApiError");

exports.create = async (req, res, next) => {
  const { name, slug } = req.body;
  if (!name || !slug) return next(new ApiError("VALIDATION_ERROR", 400, "Name and slug required"));
  const exists = await Category.findOne({ slug });
  if (exists) return next(new ApiError("VALIDATION_ERROR", 400, "Slug already exists"));
  const category = await Category.create({ name, slug });
  res.status(201).json({ data: category });
};

exports.list = async (req, res) => {
  const categories = await Category.find({ active: true });
  res.json({ data: categories });
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  const category = await Category.findByIdAndUpdate(id, { name, slug }, { new: true });
  if (!category) return next(new ApiError("NOT_FOUND", 404, "Category not found"));
  res.json({ data: category });
};

exports.remove = async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return next(new ApiError("NOT_FOUND", 404, "Category not found"));
  res.json({ data: category });
};