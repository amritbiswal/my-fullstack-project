const Booking = require("../../models/Booking.model");
const BookingLineItem = require("../../models/BookingLineItem.model");
const Reservation = require("../../models/Reservation.model");
const InventoryUnit = require("../../models/InventoryUnit.model");
const PlatformSKU = require("../../models/PlatformSKU.model");
const DepositHold = require("../../models/DepositHold.model");
const { ApiError } = require("../../error-handling/ApiError");
const bookingService = require("../../modules/booking/booking.service");

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const {
      skuId,
      cityId,
      startDate,
      endDate,
      deliveryOption,
      deliveryAddress,
      notes,
    } = req.body;
    if (!skuId || !cityId || !startDate || !endDate)
      return next(
        new ApiError("VALIDATION_ERROR", 400, "Missing required fields"),
      );

    // Use the booking service for allocation and booking creation
    console.log("Creating booking for user:", req.user.userId);
    const booking = await bookingService.createBooking({
      userId: req.user.id || req.user.userId,
      skuId,
      cityId,
      startDate,
      endDate,
      deliveryOption,
      deliveryAddress,
      notes,
    });

    res.status(201).json({ data: booking });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/confirm
exports.confirmBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("userId");
    if (!booking)
      return next(new ApiError("NOT_FOUND", 404, "Booking not found"));
    if (String(booking.userId) !== String(req.user.id || req.user.userId)) {
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
    const lineItem = await BookingLineItem.findOne({ bookingId: booking._id });
    const unit = await InventoryUnit.findById(
      lineItem.allocatedUnitId,
    ).populate("skuId");
    const depositAmount =
      unit && unit.skuId ? unit.skuId.depositAmount || 0 : 0;

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

// GET /api/bookings/my
exports.listMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id || req.user.userId,
    })
      .sort({ createdAt: -1 })
      .populate("cityId")
      .populate("zoneId");
    res.json({ data: bookings });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:id
exports.getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("cityId")
      .populate("zoneId");
    if (!booking)
      return next(new ApiError("NOT_FOUND", 404, "Booking not found"));
    if (String(booking.userId) !== String(req.user.id || req.user.userId)) {
      return next(
        new ApiError("AUTH_FORBIDDEN", 403, "You do not own this booking"),
      );
    }
    res.json({ data: booking });
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking)
      return next(new ApiError("NOT_FOUND", 404, "Booking not found"));
    if (String(booking.userId) !== String(req.user.id || req.user.userId)) {
      return next(
        new ApiError("AUTH_FORBIDDEN", 403, "You do not own this booking"),
      );
    }
    if (!["CONFIRMED", "PENDING_CONFIRMATION"].includes(booking.status)) {
      return next(
        new ApiError("VALIDATION_ERROR", 400, "Booking cannot be cancelled"),
      );
    }
    booking.status = "CANCELLED";
    await booking.save();

    // Cancel reservation(s)
    await Reservation.updateMany(
      { bookingId: booking._id, status: "ACTIVE" },
      { $set: { status: "CANCELLED" } },
    );

    res.json({ data: { bookingId: booking._id, status: booking.status } });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/provider
exports.listProviderBookings = async (req, res, next) => {
  try {
    // Find all units owned by this provider
    const providerUnits = await InventoryUnit.find({
      providerId: req.user.providerProfileId,
    }).select("_id");
    const unitIds = providerUnits.map((u) => u._id);

    // Find reservations for these units
    const reservations = await Reservation.find({
      unitId: { $in: unitIds },
      status: "ACTIVE",
    });
    const bookingIds = reservations.map((r) => r.bookingId);

    // Find bookings
    const bookings = await Booking.find({ _id: { $in: bookingIds } })
      .populate("userId")
      .populate("cityId")
      .populate("zoneId");
    res.json({ data: bookings });
  } catch (err) {
    next(err);
  }
};
