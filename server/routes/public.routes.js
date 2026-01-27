const express = require("express");
const router = express.Router();
const geoCtrl = require("../modules/geo/public.controller");
const publicCatalogCtrl = require("../modules/publicCatalog/publicCatalog.controller");

// Public endpoints (no auth)
router.get("/cities", geoCtrl.listCities);
router.get("/zones", geoCtrl.listZones);
router.get("/categories", publicCatalogCtrl.getCategories);
router.get("/skus", publicCatalogCtrl.getSkus);
router.get("/skus/:id", publicCatalogCtrl.getSkuDetails);

module.exports = router;
