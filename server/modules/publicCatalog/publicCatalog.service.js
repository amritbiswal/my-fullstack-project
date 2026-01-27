const InventoryUnit = require("../../models/InventoryUnit.model");
const AvailabilityWindow = require("../../models/AvailabilityWindow.model");
const Reservation = require("../../models/Reservation.model");
const PlatformSKU = require("../../models/PlatformSKU.model");

exports.checkSkuAvailability = async ({ skuId, cityId, startDate, endDate }) => {
  // 1. Find ACTIVE units for skuId + cityId
  const units = await InventoryUnit.find({
    skuId, cityId, status: "ACTIVE"
  }).select("_id");

  if (!units.length) return { availableUnitIds: [], availableCount: 0 };

  // 2. Filter units with an AvailabilityWindow covering [startDate, endDate)
  const unitIds = units.map(u => u._id);
  const windows = await AvailabilityWindow.find({
    unitId: { $in: unitIds },
    startDate: { $lte: new Date(startDate) },
    endDate: { $gte: new Date(endDate) }
  }).select("unitId");

  const windowUnitIds = windows.map(w => String(w.unitId));
  if (!windowUnitIds.length) return { availableUnitIds: [], availableCount: 0 };

  // 3. Exclude units with overlapping reservations
  const reserved = await Reservation.find({
    unitId: { $in: windowUnitIds },
    status: "ACTIVE",
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) }
  }).select("unitId");

  const reservedIds = new Set(reserved.map(r => String(r.unitId)));
  const availableUnitIds = windowUnitIds.filter(id => !reservedIds.has(id));

  return { availableUnitIds, availableCount: availableUnitIds.length };
};