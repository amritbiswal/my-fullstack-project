class ApiError extends Error {
  constructor(code, status, message, details) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function assertOwnership({ ownerUserId, reqUserId }) {
  if (String(ownerUserId) !== String(reqUserId)) {
    throw new ApiError("NOT_FOUND", 404, "Resource not found");
  }
}

module.exports = { ApiError, assertOwnership };
