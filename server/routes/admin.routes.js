const express = require("express");
const router = express.Router();
const authRequired = require("../middlewares/authRequired.middleware");
const requireRole = require("../middlewares/requireRole.middleware");
const depositCtrl = require("../modules/admin/deposit.controller");
const adminSourcingCtrl = require("../modules/admin/sourcing.controller");
const categoryCtrl = require("../modules/catalog/category.controller");
const skuCtrl = require("../modules/catalog/sku.controller");

const { validateBody } = require("../middlewares/validate.middleware");
const { categorySchema } = require("../modules/catalog/category.schemas");
const { skuSchema } = require("../modules/catalog/sku.schemas");

// Only admins can access these routes
router.use(authRequired, requireRole(["ADMIN"]));

// Category CRUD
router.post("/categories", validateBody(categorySchema), categoryCtrl.create);
router.get("/categories", categoryCtrl.list);
router.put("/categories/:id", validateBody(categorySchema), categoryCtrl.update);
router.delete("/categories/:id", categoryCtrl.remove);

// SKU CRUD
router.post("/skus", validateBody(skuSchema), skuCtrl.create);
router.get("/skus", skuCtrl.list);
router.put("/skus/:id", validateBody(skuSchema), skuCtrl.update);
router.delete("/skus/:id", skuCtrl.remove);

// Deposit adjustments
router.patch("/deposits/:id/adjust", depositCtrl.adjustDeposit);

// Admin sourcing decisions
router.post("/offers/:offerId/decide", adminSourcingCtrl.decideOffer);

module.exports = router;