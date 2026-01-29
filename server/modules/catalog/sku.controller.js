const PlatformSKU = require("../../models/PlatformSKU.model");
const { ApiError } = require("../../error-handling/ApiError");

exports.create = async (req, res, next) => {
  const {
    name,
    slug,
    description,
    categoryId,
    images,
    pricePerDay,
    depositAmount,
    transactionMode,
    verificationRequired,
    deliveryAllowed,
    allowedCityIds,
  } = req.body;
  if (!name || !slug || !categoryId || !pricePerDay || !transactionMode)
    return next(
      new ApiError("VALIDATION_ERROR", 400, "Missing required fields"),
    );
  const exists = await PlatformSKU.findOne({ slug });
  if (exists)
    return next(new ApiError("VALIDATION_ERROR", 400, "Slug already exists"));
  const sku = await PlatformSKU.create({
    name,
    slug,
    description,
    categoryId,
    images,
    pricePerDay,
    depositAmount,
    transactionMode,
    verificationRequired,
    deliveryAllowed,
    allowedCityIds,
  });
  res.status(201).json({ data: sku });
};

exports.list = async (req, res) => {
  const skus = await PlatformSKU.find({ active: true }).populate(
    "categoryId allowedCityIds",
  );
  res.json({ data: skus });
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;
  const sku = await PlatformSKU.findByIdAndUpdate(id, update, { new: true });
  if (!sku) return next(new ApiError("NOT_FOUND", 404, "SKU not found"));
  res.json({ data: sku });
};

exports.remove = async (req, res, next) => {
  const { id } = req.params;
  const sku = await PlatformSKU.findByIdAndDelete(id);
  if (!sku) return next(new ApiError("NOT_FOUND", 404, "SKU not found"));
  res.json({ data: sku });
};
