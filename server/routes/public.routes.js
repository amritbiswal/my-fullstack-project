const express = require("express");
const router = express.Router();
const geoCtrl = require("../modules/geo/public.controller");

// Public endpoints (no auth)
router.get("/cities", geoCtrl.listCities);
router.get("/zones", geoCtrl.listZones);

module.exports = router;