const User = require("../../models/User.model");
const { hashPassword, verifyPassword, signAccessToken } = require("../../utils/auth");
const ApiError = require("../../error-handling/ApiError");

async function register({ name, email, password, role }) {
  // Check for duplicate email
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError("AUTH_DUPLICATE_EMAIL", 409, "Email already registered");
  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role });
  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS", 401, "Invalid credentials");
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new ApiError("AUTH_INVALID_CREDENTIALS", 401, "Invalid credentials");
  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError("AUTH_USER_NOT_FOUND", 404, "User not found");
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

module.exports = { register, login, getMe };