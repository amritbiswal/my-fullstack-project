const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../error-handling/ApiError");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function signAccessToken({ userId, role }) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { userId: payload.userId, role: payload.role };
  } catch (err) {
    throw new ApiError("AUTH_INVALID_TOKEN", 401, "Invalid or expired token");
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  signAccessToken,
  verifyAccessToken,
};