const express = require("express");
const router = express.Router();
const authRequired = require("../middlewares/authRequired.middleware");
const requireRole = require("../middlewares/requireRole.middleware");
const verificationCtrl = require("../modules/staff/verification.controller");

// Only staff and admin can access
router.use(authRequired, requireRole(["STAFF_VERIFIER", "ADMIN"]));

// Queue of pending units by city
router.get("/units/pending", verificationCtrl.pendingUnitsByCity);

// Approve/reject a unit
router.post("/units/:id/verify", verificationCtrl.verifyUnit);

module.exports = router;