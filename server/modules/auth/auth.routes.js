const express = require("express");
const router = express.Router();
const { register, login, me } = require("./auth.controller");
const { authLimiter } = require("../../config/security");
const authMiddleware = require("../../middlewares/authRequired.middleware");

router.post("/register", authLimiter, ...register);
router.post("/login", authLimiter, ...login);
router.get("/me", authMiddleware, ...me);

module.exports = router;