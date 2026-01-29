const express = require("express");
const router = express.Router();
const authRequired = require("../middlewares/authRequired.middleware");
const requireRole = require("../middlewares/requireRole.middleware");
const profileCtrl = require("../modules/provider/profile.controller");
const inventoryCtrl = require("../modules/inventory/inventory.controller");
const availabilityCtrl = require("../modules/inventory/availability.controller");
const skuCtrl = require("../modules/catalog/sku.controller");

const { validateBody } = require("../middlewares/validate.middleware");
const {
  inventoryUnitSchema,
} = require("../modules/inventory/inventory.schemas");
const {
  providerProfileSchema,
} = require("../modules/provider/profile.schemas");

// All routes require provider role
router.use(
  authRequired,
  requireRole(["PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"]),
);

// Provider profile
router.get("/profile", profileCtrl.getProfile);
router.put(
  "/profile",
  validateBody(providerProfileSchema),
  profileCtrl.upsertProfile,
);
//skus available to provider
router.get("/skus", skuCtrl.list);

// Inventory units
router.post("/units", validateBody(inventoryUnitSchema), inventoryCtrl.create);
router.get("/units", inventoryCtrl.list);
router.get("/units/:id", inventoryCtrl.get);
router.put(
  "/units/:id",
  validateBody(inventoryUnitSchema),
  inventoryCtrl.update,
);
router.delete("/units/:id", inventoryCtrl.remove);
router.patch("/units/:id/status", inventoryCtrl.updateStatus);
router.post("/units/:id/submit", inventoryCtrl.submitUnit);
router.get("/units/:unitId/verification", inventoryCtrl.unitVerificationHistory);

// Availability windows
router.post("/units/:id/availability", availabilityCtrl.addWindow);
router.get("/units/:id/availability", availabilityCtrl.listWindows);
router.delete("/availability/:availabilityId", availabilityCtrl.removeWindow);

module.exports = router;
