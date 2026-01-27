const InventoryUnit = require("../../models/InventoryUnit.model");
const AvailabilityWindow = require("../../models/AvailabilityWindow.model");
const Reservation = require("../../models/Reservation.model");

exports.allocateUnitForBooking = async ({ skuId, cityId, startDate, endDate }) => {
  // 1. Find candidate ACTIVE units
  const units = await InventoryUnit.find({ skuId, cityId, status: "ACTIVE" });
  if (!units.length) return null;

  // 2. Filter by availability window
  const unitIds = units.map(u => u._id);
  const windows = await AvailabilityWindow.find({
    unitId: { $in: unitIds },
    startDate: { $lte: new Date(startDate) },
    endDate: { $gte: new Date(endDate) }
  });
  const availableUnitIds = windows.map(w => String(w.unitId));
  if (!availableUnitIds.length) return null;

  // 3. Exclude units with overlapping reservations
  const reserved = await Reservation.find({
    unitId: { $in: availableUnitIds },
    status: "ACTIVE",
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) }
  });
  const reservedIds = new Set(reserved.map(r => String(r.unitId)));
  const candidates = units.filter(u => availableUnitIds.includes(String(u._id)) && !reservedIds.has(String(u._id)));

  // 4. Rank by condition and least future load
  candidates.sort((a, b) => {
    const conditionRank = { NEW: 0, EXCELLENT: 1, GOOD: 2, FAIR: 3 };
    if (conditionRank[a.condition] !== conditionRank[b.condition]) {
      return conditionRank[a.condition] - conditionRank[b.condition];
    }
    // Least future reservations
    return a.futureReservations - b.futureReservations;
  });

  return candidates.length ? candidates[0]._id : null;
};