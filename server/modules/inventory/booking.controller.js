const Booking = require("../../models/Booking.model");
const BookingLineItem = require("../../models/BookingLineItem.model");
const InventoryUnit = require("../../models/InventoryUnit.model");
const AvailabilityWindow = require("../../models/AvailabilityWindow.model");
const ApiError = require("../../error-handling/ApiError");

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { skuId, cityId, startDate, endDate, delivery } = req.body;
    if (!skuId || !cityId || !startDate || !endDate)
      return next(
        new ApiError("VALIDATION_ERROR", 400, "Missing required fields"),
      );

    // 1. Find all ACTIVE units for this SKU and city
    const candidateUnits = await InventoryUnit.find({
      skuId,
      cityId,
      status: "ACTIVE",
    });

    // 2. Find a unit with an availability window covering the requested dates and not already reserved
    let allocatedUnit = null;
    for (const unit of candidateUnits) {
      // Check availability window
      const window = await AvailabilityWindow.findOne({
        unitId: unit._id,
        startDate: { $lte: new Date(startDate) },
        endDate: { $gte: new Date(endDate) },
      });
      if (!window) continue;

      // Check for overlapping bookings (reservation lock)
      const overlapping = await BookingLineItem.findOne({
        unitId: unit._id,
        $or: [
          { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
          { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
          {
            startDate: { $lte: new Date(startDate) },
            endDate: { $gte: new Date(endDate) },
          },
        ],
      });
      if (!overlapping) {
        allocatedUnit = unit;
        break;
      }
    }

    if (!allocatedUnit) {
      return next(
        new ApiError(
          "VALIDATION_ERROR",
          400,
          "No available units for these dates",
        ),
      );
    }

    // 3. Create booking and line item (reservation lock)
    const booking = await Booking.create({
      userId: req.user.id,
      status: "PENDING_CONFIRMATION",
      depositHeld: false,
    });

    const lineItem = await BookingLineItem.create({
      bookingId: booking._id,
      unitId: allocatedUnit._id,
      startDate,
      endDate,
      price: 0, // Set price logic as needed
    });

    booking.lineItems = [lineItem._id];
    await booking.save();

    res.status(201).json({
      data: {
        bookingId: booking._id,
        status: booking.status,
        unitId: allocatedUnit._id,
        startDate,
        endDate,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/confirm
exports.confirmBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("lineItems");
    if (!booking)
      return next(new ApiError("NOT_FOUND", 404, "Booking not found"));
    if (booking.userId.toString() !== req.user.id) {
      return next(
        new ApiError("AUTH_FORBIDDEN", 403, "You do not own this booking"),
      );
    }
    if (booking.status !== "PENDING_CONFIRMATION") {
      return next(
        new ApiError("VALIDATION_ERROR", 400, "Booking cannot be confirmed"),
      );
    }
    booking.status = "CONFIRMED";
    booking.depositHeld = true;
    await booking.save();

    // Find deposit amount from SKU
    const lineItem = await BookingLineItem.findById(booking.lineItems[0]);
    const unit = await InventoryUnit.findById(lineItem.unitId).populate(
      "skuId",
    );
    const depositAmount = unit.skuId.depositAmount || 0;

    // Create DepositHold record
    await DepositHold.create({
      bookingId: booking._id,
      userId: booking.userId,
      amount: depositAmount,
      status: "HELD",
      notes: "Deposit held on booking confirmation",
    });

    res.json({ data: { bookingId: booking._id, status: booking.status } });
  } catch (err) {
    next(err);
  }
};
