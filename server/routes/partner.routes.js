const express = require("express");
const router = express.Router();
const authRequired = require("../middlewares/authRequired.middleware");
const requireRole = require("../middlewares/requireRole.middleware");

// Only partners can access these routes
router.use(authRequired, requireRole(["PARTNER", "DELIVERY_PARTNER"]));

// Example protected route
router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome, partner!" });
});

module.exports = router;