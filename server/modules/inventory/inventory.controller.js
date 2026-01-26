const InventoryUnit = require("../../models/InventoryUnit.model");
const PlatformSKU = require("../../models/PlatformSKU.model");
const ProviderProfile = require("../../models/ProviderProfile.model");
const ApiError = require("../../error-handling/ApiError");

// Helper for ownership assertion
function assertOwnership({ ownerUserId, reqUserId }) {
  if (String(ownerUserId) !== String(reqUserId)) {
    // 404 to avoid leakage
    throw new ApiError("NOT_FOUND", 404, "Resource not found");
  }
}

// POST /api/provider/units
exports.create = async (req, res, next) => {
  try {
    const { skuId, cityId, zoneId, condition, photos, title, deliveryOptions } = req.body;
    const providerProfile = await ProviderProfile.findOne({ userId: req.user.userId });
    if (!providerProfile) return next(new ApiError("NOT_FOUND", 404, "Provider profile not found"));

    const sku = await PlatformSKU.findById(skuId);
    if (!sku) return next(new ApiError("NOT_FOUND", 404, "SKU not found"));

    const unit = await InventoryUnit.create({
      skuId,
      providerId: providerProfile._id,
      ownerUserId: req.user.id,
      cityId,
      zoneId,
      condition,
      photos,
      title,
      deliveryOptions,
      status: "DRAFT",
    });
    res.status(201).json({ data: unit });
  } catch (err) {
    next(err);
  }
};

// GET /api/provider/units
exports.list = async (req, res, next) => {
  try {
    const providerProfile = await ProviderProfile.findOne({ userId: req.user.userId });
    if (!providerProfile) return next(new ApiError("NOT_FOUND", 404, "Provider profile not found"));
    const units = await InventoryUnit.find({ providerId: providerProfile._id, ownerUserId: req.user.userId }).populate("skuId");
    res.json({ data: units });
  } catch (err) {
    next(err);
  }
};

// GET /api/provider/units/:id
exports.get = async (req, res, next) => {
  try {
    const unit = await InventoryUnit.findById(req.params.id);
    if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
    assertOwnership({ ownerUserId: unit.ownerUserId, reqUserId: req.user.id });
    res.json({ data: unit });
  } catch (err) {
    next(err);
  }
};

// PUT /api/provider/units/:id
exports.update = async (req, res, next) => {
  try {
    const unit = await InventoryUnit.findById(req.params.id);
    if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
    assertOwnership({ ownerUserId: unit.ownerUserId, reqUserId: req.user.id });
    Object.assign(unit, req.body);
    await unit.save();
    res.json({ data: unit });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/provider/units/:id
exports.remove = async (req, res, next) => {
  try {
    const unit = await InventoryUnit.findById(req.params.id);
    if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
    assertOwnership({ ownerUserId: unit.ownerUserId, reqUserId: req.user.id });
    await unit.deleteOne();
    res.json({ data: true });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/provider/units/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const unit = await InventoryUnit.findById(id);
    if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
    assertOwnership({ ownerUserId: unit.ownerUserId, reqUserId: req.user.id });

    // Only allow provider transitions: DRAFT <-> SUBMITTED
    const allowed = ["DRAFT", "SUBMITTED"];
    if (!allowed.includes(status)) {
      return next(new ApiError("VALIDATION_ERROR", 400, "Invalid status for provider"));
    }
    unit.status = status;
    await unit.save();
    res.json({ data: unit });
  } catch (err) {
    next(err);
  }
};