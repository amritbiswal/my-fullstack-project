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

router.get("/queue", verificationCtrl.getQueue);
router.post("/:taskId/claim", verificationCtrl.claimTask);
router.post("/:taskId/release", verificationCtrl.releaseTask);
router.post("/:taskId/approve", verificationCtrl.approveTask);
router.post("/:taskId/reject", verificationCtrl.rejectTask);
router.get("/units/:unitId/history", verificationCtrl.unitHistory);

module.exports = router;