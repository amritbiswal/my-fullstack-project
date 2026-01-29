const AvailabilityWindow = require("../../models/AvailabilityWindow.model");
const InventoryUnit = require("../../models/InventoryUnit.model");
const ProviderProfile = require("../../models/ProviderProfile.model");
const { ApiError } = require("../../error-handling/ApiError");

// POST /api/provider/units/:id/availability
exports.addWindow = async (req, res, next) => {
  try {
    const { id: unitId } = req.params;
    const { startDate, endDate, note } = req.body;

    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      return next(
        new ApiError("VALIDATION_ERROR", 400, "Invalid start/end dates"),
      );
    }

    const unit = await InventoryUnit.findById(unitId);
    if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));

    const providerProfile = await ProviderProfile.findOne({
      userId: req.user.userId,
    });
    if (
      !providerProfile ||
      unit.providerId.toString() !== providerProfile._id.toString()
    ) {
      return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
    }

    // Check for overlapping windows
    const overlap = await AvailabilityWindow.findOne({
      unitId,
      $or: [
        { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) },
        },
      ],
    });
    if (overlap) {
      return next(
        new ApiError(
          "VALIDATION_ERROR",
          400,
          "Overlapping availability window",
        ),
      );
    }

    const window = await AvailabilityWindow.create({
      unitId,
      startDate,
      endDate,
      note,
    });
    res.status(201).json({ data: window });
  } catch (err) {
    next(err);
  }
};

// GET /api/provider/units/:id/availability
exports.listWindows = async (req, res, next) => {
  try {
    const { id: unitId } = req.params;
    const unit = await InventoryUnit.findById(unitId);
    const providerProfile = await ProviderProfile.findOne({
      userId: req.user.userId,
    });
    if (
      !unit ||
      !providerProfile ||
      unit.providerId.toString() !== providerProfile._id.toString()
    ) {
      return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
    }
    const windows = await AvailabilityWindow.find({ unitId });
    res.json({ data: windows });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/provider/availability/:availabilityId
exports.removeWindow = async (req, res, next) => {
  try {
    const { availabilityId } = req.params;
    const window = await AvailabilityWindow.findById(availabilityId);
    if (!window)
      return next(
        new ApiError("NOT_FOUND", 404, "Availability window not found"),
      );

    const unit = await InventoryUnit.findById(window.unitId);
    const providerProfile = await ProviderProfile.findOne({
      userId: req.user.userId,
    });
    if (
      !unit ||
      !providerProfile ||
      unit.providerId.toString() !== providerProfile._id.toString()
    ) {
      return next(
        new ApiError("NOT_FOUND", 404, "Availability window not found"),
      );
    }

    await window.deleteOne();
    res.json({ data: true });
  } catch (err) {
    next(err);
  }
};
