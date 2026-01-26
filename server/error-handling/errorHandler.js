const { ApiError } = require("./ApiError");

module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status || 500).json({
      code: err.code || "INTERNAL_ERROR",
      message: err.message,
      details: err.details || null,
    });
  } else {
    res.status(500).json({
      code: "INTERNAL_ERROR",
      message: err.message || "Unexpected error",
      details: null,
    });
  }
};