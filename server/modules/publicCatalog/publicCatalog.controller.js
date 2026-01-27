const publicCatalogService = require("./publicCatalog.service");
const PlatformSKU = require("../../models/PlatformSKU.model");
const Category = require("../../models/Category.model");
const InventoryUnit = require("../../models/InventoryUnit.model");

exports.getCategories = async (req, res, next) => {
  const { cityId } = req.query;
  // Find categories with at least 1 ACTIVE unit in city
  const skuIds = await InventoryUnit.distinct("skuId", { cityId, status: "ACTIVE" });
  const categoryIds = await PlatformSKU.distinct("categoryId", { _id: { $in: skuIds } });
  const categories = await Category.find({ _id: { $in: categoryIds } });
  res.json({ data: categories });
};

exports.getSkus = async (req, res, next) => {
  // Zod validation omitted for brevity
  const { cityId, startDate, endDate, categoryId, q, minPrice, maxPrice, transactionMode, deliveryAllowed, page = 1, limit = 20, sort = "price_asc" } = req.query;
  const filter = { allowedCityIds: cityId };
  if (categoryId) filter.categoryId = categoryId;
  if (transactionMode) filter.transactionMode = transactionMode;
  if (deliveryAllowed !== undefined) filter.deliveryAllowed = deliveryAllowed === "true";
  if (q) filter.name = { $regex: q, $options: "i" };
  if (minPrice || maxPrice) filter.pricePerDay = {};
  if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
  if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);

  const skus = await PlatformSKU.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort(sort === "price_asc" ? { pricePerDay: 1 } : sort === "price_desc" ? { pricePerDay: -1 } : { createdAt: -1 });

  // For each SKU, check availability
  const results = [];
  for (const sku of skus) {
    const { availableCount } = await publicCatalogService.checkSkuAvailability({
      skuId: sku._id, cityId, startDate, endDate
    });
    results.push({ ...sku.toObject(), availableCount, isAvailable: availableCount > 0 });
  }
  res.json({ data: results, meta: { page, limit } });
};

exports.getSkuDetails = async (req, res, next) => {
  const { id } = req.params;
  const { cityId, startDate, endDate } = req.query;
  const sku = await PlatformSKU.findById(id);
  if (!sku) return res.status(404).json({ error: "SKU not found" });
  const { availableCount } = await publicCatalogService.checkSkuAvailability({
    skuId: id, cityId, startDate, endDate
  });
  res.json({
    data: {
      ...sku.toObject(),
      availableCount,
      policies: {
        deposit: sku.depositAmount,
        verificationRequired: sku.verificationRequired,
        deliveryAllowed: sku.deliveryAllowed,
        transactionMode: sku.transactionMode
      }
    }
  });
};