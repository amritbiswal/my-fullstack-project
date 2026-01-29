const InventoryUnit = require("../../models/InventoryUnit.model");
const PlatformSKU = require("../../models/PlatformSKU.model");
const ProviderProfile = require("../../models/ProviderProfile.model");
const { ApiError } = require("../../error-handling/ApiError");
const VerificationTask = require("../../models/VerificationTask.model");
const VerificationReport = require("../../models/VerificationReport.model");

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
    const { skuId, cityId, zoneId, condition, photos, title, deliveryOptions } =
      req.body;
    const providerProfile = await ProviderProfile.findOne({
      userId: req.user.userId,
    });
    if (!providerProfile)
      return next(new ApiError("NOT_FOUND", 404, "Provider profile not found"));

    const sku = await PlatformSKU.findById(skuId);
    if (!sku) return next(new ApiError("NOT_FOUND", 404, "SKU not found"));

    const unit = await InventoryUnit.create({
      skuId,
      providerId: providerProfile._id,
      ownerUserId: req.user.userId,
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
    const providerProfile = await ProviderProfile.findOne({
      userId: req.user.userId,
    });
    if (!providerProfile)
      return next(new ApiError("NOT_FOUND", 404, "Provider profile not found"));
    const units = await InventoryUnit.find({
      providerId: providerProfile._id,
      ownerUserId: req.user.userId,
    });
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
    assertOwnership({
      ownerUserId: unit.ownerUserId,
      reqUserId: req.user.userId,
    });
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
    assertOwnership({
      ownerUserId: unit.ownerUserId,
      reqUserId: req.user.userId,
    });
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
    assertOwnership({
      ownerUserId: unit.ownerUserId,
      reqUserId: req.user.userId,
    });
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
    assertOwnership({
      ownerUserId: unit.ownerUserId,
      reqUserId: req.user.userId,
    });

    // Only allow provider transitions: DRAFT <-> SUBMITTED
    const allowed = ["DRAFT", "SUBMITTED"];
    if (!allowed.includes(status)) {
      return next(
        new ApiError("VALIDATION_ERROR", 400, "Invalid status for provider"),
      );
    }
    unit.status = status;
    await unit.save();
    res.json({ data: unit });
  } catch (err) {
    next(err);
  }
};

exports.submitUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const unit = await InventoryUnit.findById(id);
    if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));

    // Ownership check
    if (String(unit.ownerUserId) !== String(req.user.userId)) {
      return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
    }

    // Idempotency: Only allow if DRAFT or SUBMITTED
    if (["PENDING_VERIFICATION", "ACTIVE"].includes(unit.status)) {
      return res.json({
        data: {
          message: "Unit already submitted or active",
          unitId: unit._id,
          status: unit.status,
        },
      });
    }

    // Update unit status
    unit.status = "PENDING_VERIFICATION";
    await unit.save();

    // Check for existing pending onboarding task
    const existingTask = await VerificationTask.findOne({
      unitId: unit._id,
      type: "UNIT_ONBOARDING",
      status: { $in: ["PENDING", "IN_PROGRESS"] },
    });
    if (existingTask) {
      return res.json({
        data: {
          message: "Verification task already exists",
          taskId: existingTask._id,
          unitId: unit._id,
        },
      });
    }

    // Get provider profile
    const providerProfile = await ProviderProfile.findById(unit.providerId);
    if (!providerProfile)
      return next(new ApiError("NOT_FOUND", 404, "Provider profile not found"));

    // Create verification task
    const task = await VerificationTask.create({
      type: "UNIT_ONBOARDING",
      unitId: unit._id,
      providerId: providerProfile._id,
      cityId: unit.cityId,
      status: "PENDING",
    });

    res.status(201).json({
      data: {
        message: "Unit submitted for verification",
        taskId: task._id,
        unitId: unit._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/provider/units/:unitId/verification
exports.unitVerificationHistory = async (req, res, next) => {
  const { unitId } = req.params;
  const unit = await InventoryUnit.findById(unitId);
  if (
    !unit ||
    String(unit.ownerUserId) !== String(req.user.id || req.user.userId)
  ) {
    return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
  }
  const tasks = await VerificationTask.find({ unitId }).sort({ createdAt: -1 });
  const reports = await VerificationReport.find({
    taskId: { $in: tasks.map((t) => t._id) },
  });
  res.json({ data: { tasks, reports } });
};
