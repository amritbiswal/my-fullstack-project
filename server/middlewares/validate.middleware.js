const { ApiError } = require("../error-handling/ApiError");

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new ApiError(
          "VALIDATION_ERROR",
          400,
          "Invalid request body",
          result.error.errors,
        ),
      );
    }
    req.body = result.data;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(
        new ApiError(
          "VALIDATION_ERROR",
          400,
          "Invalid query parameters",
          result.error.errors,
        ),
      );
    }
    req.query = result.data;
    next();
  };
}

function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(
        new ApiError(
          "VALIDATION_ERROR",
          400,
          "Invalid route parameters",
          result.error.errors,
        ),
      );
    }
    req.params = result.data;
    next();
  };
}

module.exports = { validateBody, validateQuery, validateParams };
