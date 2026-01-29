const { ApiError } = require("../error-handling/ApiError");

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          "AUTH_FORBIDDEN",
          403,
          "You do not have permission to access this resource",
        ),
      );
    }
    next();
  };
}

module.exports = requireRole;
