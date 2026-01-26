const User = require("../models/User.model");
const { verifyAccessToken } = require("../utils/auth");
const ApiError = require("../error-handling/ApiError");

module.exports = async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("AUTH_MISSING_TOKEN", 401, "Authorization token required");
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      throw new ApiError("AUTH_INVALID_TOKEN", 401, "Invalid or expired token");
    }
    const user = await User.findById(payload.userId);
    console.log("user:", user);
    if (!user || !user.isActive) {
      console.log("User not found or inactive");
      throw new ApiError("AUTH_USER_DISABLED", 403, "User account is disabled");
    }
    req.user = { userId: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};