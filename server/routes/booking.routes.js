const express = require("express");
const router = express.Router();
const authRequired = require("../middlewares/authRequired.middleware");
const bookingCtrl = require("../modules/inventory/booking.controller");

router.use(authRequired);

router.post("/", bookingCtrl.createBooking);
router.patch("/:id/confirm", bookingCtrl.confirmBooking);

module.exports = router;