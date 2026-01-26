const PlatformSKU = require("../../models/PlatformSKU.model");
const InventoryUnit = require("../../models/InventoryUnit.model");
const AvailabilityWindow = require("../../models/AvailabilityWindow.model");
const ApiError = require("../../error-handling/ApiError");

// GET /api/catalog/search?cityId=...&startDate=...&endDate=...
exports.search = async (req, res, next) => {
  const { cityId, startDate, endDate } = req.query;
  if (!cityId || !startDate || !endDate) {
    return next(
      new ApiError(
        "VALIDATION_ERROR",
        400,
        "cityId, startDate, and endDate are required",
      ),
    );
  }

  // Find SKUs allowed in this city
  const skus = await PlatformSKU.find({ allowedCities: cityId });

  // For each SKU, count available units for the date range
  const results = [];
  for (const sku of skus) {
    // Find ACTIVE units for this SKU and city
    const units = await InventoryUnit.find({
      skuId: sku._id,
      cityId,
      status: "ACTIVE",
    });

    // For each unit, check if it has an availability window covering the requested dates
    let availableCount = 0;
    for (const unit of units) {
      const window = await AvailabilityWindow.findOne({
        unitId: unit._id,
        startDate: { $lte: new Date(startDate) },
        endDate: { $gte: new Date(endDate) },
      });
      if (window) availableCount++;
    }

    results.push({
      sku: {
        id: sku._id,
        name: sku.name,
        description: sku.description,
        transactionMode: sku.transactionMode,
        depositAmount: sku.depositAmount,
        verificationRequired: sku.verificationRequired,
        deliveryAllowed: sku.deliveryAllowed,
        policies: sku.policies,
      },
      availableCount,
    });
  }

  res.json({ data: results });
};

// GET /api/catalog/skus/:id
exports.skuDetails = async (req, res, next) => {
  const { id } = req.params;
  const sku = await PlatformSKU.findById(id).populate(
    "categoryId allowedCities",
  );
  if (!sku) return next(new ApiError("NOT_FOUND", 404, "SKU not found"));
  res.json({
    data: {
      id: sku._id,
      name: sku.name,
      description: sku.description,
      transactionMode: sku.transactionMode,
      depositAmount: sku.depositAmount,
      verificationRequired: sku.verificationRequired,
      deliveryAllowed: sku.deliveryAllowed,
      allowedCities: sku.allowedCities,
      policies: sku.policies,
      category: sku.categoryId,
    },
  });
};
