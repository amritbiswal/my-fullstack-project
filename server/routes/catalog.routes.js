const express = require("express");
const router = express.Router();
const publicCatalog = require("../modules/catalog/public.controller");

router.get("/search", publicCatalog.search);
router.get("/skus/:id", publicCatalog.skuDetails);

module.exports = router;