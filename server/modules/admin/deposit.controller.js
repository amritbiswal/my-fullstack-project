const DepositHold = require("../../models/DepositHold.model");
const ApiError = require("../../error-handling/ApiError");

// PATCH /api/admin/deposits/:id/adjust
exports.adjustDeposit = async (req, res, next) => {
  const { id } = req.params;
  const { adjustmentAmount, adjustmentNotes } = req.body;
  const deposit = await DepositHold.findById(id);
  if (!deposit) return next(new ApiError("NOT_FOUND", 404, "DepositHold not found"));
  deposit.status = "ADJUSTED";
  deposit.adjustmentAmount = adjustmentAmount;
  deposit.adjustmentNotes = adjustmentNotes;
  deposit.adjustedBy = req.user.userId;
  await deposit.save();
  res.json({ data: deposit });
};