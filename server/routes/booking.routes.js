const express = require("express");
const router = express.Router();
const authRequired = require("../middlewares/authRequired.middleware");
const bookingCtrl = require("../modules/inventory/booking.controller");
const requireRole = require("../middlewares/requireRole.middleware");

router.use(authRequired);

router.post("/", bookingCtrl.createBooking);
router.patch("/:id/confirm", bookingCtrl.confirmBooking);
router.get(
  "/my",
  authRequired,
  requireRole(["TOURIST"]),
  bookingCtrl.listMyBookings,
);
router.get(
  "/:id",
  authRequired,
  requireRole(["TOURIST"]),
  bookingCtrl.getBooking,
);
router.post(
  "/:id/cancel",
  authRequired,
  requireRole(["TOURIST"]),
  bookingCtrl.cancelBooking,
);
router.get(
  "/provider",
  authRequired,
  requireRole(["PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"]),
  bookingCtrl.listProviderBookings,
);

module.exports = router;
