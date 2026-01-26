const InventoryUnit = require("../../models/InventoryUnit.model");
const City = require("../../models/City.model");
const ApiError = require("../../error-handling/ApiError");

// List all units pending verification in a city
exports.pendingUnitsByCity = async (req, res, next) => {
  const { cityId } = req.query;
  if (!cityId)
    return next(new ApiError("VALIDATION_ERROR", 400, "cityId required"));
  const city = await City.findById(cityId);
  if (!city) return next(new ApiError("NOT_FOUND", 404, "City not found"));
  const units = await InventoryUnit.find({
    cityId,
    status: "PENDING_VERIFICATION",
  }).populate("skuId providerId");
  res.json({ data: units });
};

// Approve (activate) or reject a unit
exports.verifyUnit = async (req, res, next) => {
  const { id } = req.params;
  const { action, evidenceUrls } = req.body; // action: "APPROVE" or "REJECT"
  const unit = await InventoryUnit.findById(id);
  if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
  if (unit.status !== "PENDING_VERIFICATION") {
    return next(
      new ApiError("VALIDATION_ERROR", 400, "Unit is not pending verification"),
    );
  }

  // Placeholder for evidence upload
  unit.evidenceUrls = evidenceUrls || [];

  if (action === "APPROVE") {
    unit.status = "ACTIVE";
  } else if (action === "REJECT") {
    unit.status = "DRAFT";
  } else {
    return next(new ApiError("VALIDATION_ERROR", 400, "Invalid action"));
  }
  await unit.save();
  res.json({ data: unit });
};
