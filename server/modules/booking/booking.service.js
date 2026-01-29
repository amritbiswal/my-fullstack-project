const Booking = require("../../models/Booking.model");
const BookingLineItem = require("../../models/BookingLineItem.model");
const Reservation = require("../../models/Reservation.model");
const PlatformSKU = require("../../models/PlatformSKU.model");
const allocationService = require("./allocation.service");
const { ApiError } = require("../../error-handling/ApiError");

exports.createBooking = async ({
  userId,
  skuId,
  cityId,
  startDate,
  endDate,
  deliveryOption,
  deliveryAddress,
  notes,
}) => {
  const sku = await PlatformSKU.findById(skuId);
  if (!sku) throw new ApiError("NOT_FOUND", 404, "SKU not found");
  if (!sku.allowedCityIds.map(String).includes(String(cityId)))
    throw new ApiError("NOT_ALLOWED", 400, "SKU not available in city");

  const days =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
  if (days < 1)
    throw new ApiError("VALIDATION_ERROR", 400, "Invalid date range");

  // let allocatedUnitId = null;
  // if (sku.transactionMode === "MANAGED_RENTAL") {
  //   allocatedUnitId = await allocationService.allocateUnitForBooking({
  //     skuId,
  //     cityId,
  //     startDate,
  //     endDate,
  //   });
  //   if (!allocatedUnitId)
  //     throw new ApiError("NO_AVAILABILITY", 409, "No available units");
  // }

  const booking = await Booking.create({
    userId,
    cityId,
    transactionMode: sku.transactionMode,
    status: "CONFIRMED",
    startDate,
    endDate,
    deliveryOption,
    deliveryAddress,
    pricing: {
      subtotal: sku.pricePerDay * days,
      deposit: sku.depositAmount,
      fees: 0,
      total: sku.pricePerDay * days + sku.depositAmount,
    },
  });

  await BookingLineItem.create({
    bookingId: booking._id,
    skuId,
    quantity: 1,
    // allocatedUnitId,
    snapshot: {
      pricePerDay: sku.pricePerDay,
      days,
      lineTotal: sku.pricePerDay * days,
    },
  });

  // if (allocatedUnitId) {
    // await Reservation.create({
    //   unitId: allocatedUnitId,
    //   bookingId: booking._id,
    //   startDate,
    //   endDate,
    //   status: "ACTIVE",
    // });
  // }

  return booking;
};
