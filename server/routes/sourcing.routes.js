const express = require("express");
const router = express.Router();
const authRequired = require("../middlewares/authRequired.middleware");
const requireRole = require("../middlewares/requireRole.middleware");
const sourcingCtrl = require("../modules/inventory/sourcing.controller");

// Tourist creates request
router.post("/requests", authRequired, requireRole(["TOURIST"]), sourcingCtrl.createRequest);

// Providers see open requests and submit offers
router.get("/requests/open", authRequired, requireRole(["PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"]), sourcingCtrl.listOpen);
router.post("/offers", authRequired, requireRole(["PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"]), sourcingCtrl.submitOffer);

module.exports = router;