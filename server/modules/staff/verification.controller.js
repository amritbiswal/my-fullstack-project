const VerificationTask = require("../../models/VerificationTask.model");
const VerificationReport = require("../../models/VerificationReport.model");
const InventoryUnit = require("../../models/InventoryUnit.model");
const { ApiError } = require("../../error-handling/ApiError");
const City = require("../../models/City.model");

// GET /api/staff/verifications/queue
exports.getQueue = async (req, res, next) => {
  // Zod validation omitted for brevity
  const {
    cityId,
    type = "UNIT_ONBOARDING",
    status = "PENDING",
    page = 1,
    limit = 20,
    sort = "newest",
  } = req.query;
  const filter = { cityId, type, status };
  const skip = (page - 1) * limit;
  const tasks = await VerificationTask.find(filter)
    .sort({ createdAt: sort === "newest" ? -1 : 1 })
    .skip(skip)
    .limit(Number(limit));
  const total = await VerificationTask.countDocuments(filter);
  res.json({
    data: tasks,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

// POST /api/staff/verifications/:taskId/claim
exports.claimTask = async (req, res, next) => {
  const { taskId } = req.params;
  const task = await VerificationTask.findById(taskId);
  if (!task) return next(new ApiError("NOT_FOUND", 404, "Task not found"));
  if (
    task.assignedToUserId &&
    String(task.assignedToUserId) !== String(req.user.id || req.user.userId)
  ) {
    return next(
      new ApiError(
        "VERIFICATION_TASK_ALREADY_CLAIMED",
        409,
        "Task already claimed",
      ),
    );
  }
  if (!["PENDING", "IN_PROGRESS"].includes(task.status)) {
    return next(
      new ApiError("INVALID_TASK_STATUS", 400, "Task cannot be claimed"),
    );
  }
  task.assignedToUserId = req.user.id || req.user.userId;
  task.status = "IN_PROGRESS";
  await task.save();
  res.json({ data: { taskId: task._id, status: task.status } });
};

// POST /api/staff/verifications/:taskId/release
exports.releaseTask = async (req, res, next) => {
  const { taskId } = req.params;
  const task = await VerificationTask.findById(taskId);
  if (!task) return next(new ApiError("NOT_FOUND", 404, "Task not found"));
  if (
    task.assignedToUserId &&
    String(task.assignedToUserId) !== String(req.user.id || req.user.userId) &&
    req.user.role !== "ADMIN"
  ) {
    return next(
      new ApiError("FORBIDDEN", 403, "Only claimant or admin can release"),
    );
  }
  if (task.status === "COMPLETED") {
    return next(
      new ApiError("INVALID_TASK_STATUS", 400, "Cannot release completed task"),
    );
  }
  task.assignedToUserId = null;
  task.status = "PENDING";
  await task.save();
  res.json({ data: { taskId: task._id, status: task.status } });
};

// POST /api/staff/verifications/:taskId/approve
exports.approveTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { checklist, evidence = [], notes } = req.body;
  const task = await VerificationTask.findById(taskId);
  if (!task) return next(new ApiError("NOT_FOUND", 404, "Task not found"));
  if (task.type !== "UNIT_ONBOARDING")
    return next(new ApiError("INVALID_TASK_TYPE", 400, "Not onboarding task"));
  if (!["PENDING", "IN_PROGRESS"].includes(task.status))
    return next(
      new ApiError(
        "INVALID_TASK_STATUS",
        400,
        "Task not pending or in progress",
      ),
    );
  if (
    task.assignedToUserId &&
    String(task.assignedToUserId) !== String(req.user.id || req.user.userId) &&
    req.user.role !== "ADMIN"
  ) {
    return next(
      new ApiError("FORBIDDEN", 403, "Only claimant or admin can approve"),
    );
  }
  await VerificationReport.create({
    taskId: task._id,
    result: "PASS",
    checklist,
    evidence,
    notes,
    createdByUserId: req.user.id || req.user.userId,
  });
  task.status = "COMPLETED";
  await task.save();
  const unit = await InventoryUnit.findById(task.unitId);
  unit.status = "ACTIVE";
  unit.verification = {
    verified: true,
    verifiedAt: new Date(),
    verifiedBy: req.user.id || req.user.userId,
  };
  await unit.save();
  res.json({
    data: { taskId: task._id, unitId: unit._id, unitStatus: "ACTIVE" },
  });
};

// POST /api/staff/verifications/:taskId/reject
exports.rejectTask = async (req, res, next) => {
  const { taskId } = req.params;
  const {
    checklist,
    evidence = [],
    notes,
    nextUnitStatus = "BLOCKED",
  } = req.body;
  if (!notes)
    return next(
      new ApiError("VALIDATION_ERROR", 400, "Rejection notes required"),
    );
  const task = await VerificationTask.findById(taskId);
  if (!task) return next(new ApiError("NOT_FOUND", 404, "Task not found"));
  if (task.type !== "UNIT_ONBOARDING")
    return next(new ApiError("INVALID_TASK_TYPE", 400, "Not onboarding task"));
  if (!["PENDING", "IN_PROGRESS"].includes(task.status))
    return next(
      new ApiError(
        "INVALID_TASK_STATUS",
        400,
        "Task not pending or in progress",
      ),
    );
  if (
    task.assignedToUserId &&
    String(task.assignedToUserId) !== String(req.user.id || req.user.userId) &&
    req.user.role !== "ADMIN"
  ) {
    return next(
      new ApiError("FORBIDDEN", 403, "Only claimant or admin can reject"),
    );
  }
  await VerificationReport.create({
    taskId: task._id,
    result: "FAIL",
    checklist,
    evidence,
    notes,
    createdByUserId: req.user.id || req.user.userId,
  });
  task.status = "COMPLETED";
  await task.save();
  const unit = await InventoryUnit.findById(task.unitId);
  unit.status = nextUnitStatus;
  unit.verification = {
    verified: false,
  };
  await unit.save();
  res.json({
    data: { taskId: task._id, unitId: unit._id, unitStatus: nextUnitStatus },
  });
};

// GET /api/staff/verifications/units/:unitId/history
exports.unitHistory = async (req, res, next) => {
  const { unitId } = req.params;
  const tasks = await VerificationTask.find({ unitId }).sort({ createdAt: -1 });
  const reports = await VerificationReport.find({
    taskId: { $in: tasks.map((t) => t._id) },
  });
  res.json({ data: { tasks, reports } });
};

// List all units pending verification in a city
exports.pendingUnitsByCity = async (req, res, next) => {
  const { cityId } = req.query;
  if (!cityId)
    return next(new ApiError("VALIDATION_ERROR", 400, "cityId required"));
  const city = await City.findById(cityId);
  if (!city) return next(new ApiError("NOT_FOUND", 404, "City not found"));
  const units = await InventoryUnit.find({
    cityId,
    status: "PENDING_VERIFICATION",
  }).populate("skuId providerId");
  res.json({ data: units });
};

// Approve (activate) or reject a unit
exports.verifyUnit = async (req, res, next) => {
  const { id } = req.params;
  const { action, evidenceUrls } = req.body; // action: "APPROVE" or "REJECT"
  const unit = await InventoryUnit.findById(id);
  if (!unit) return next(new ApiError("NOT_FOUND", 404, "Unit not found"));
  if (unit.status !== "PENDING_VERIFICATION") {
    return next(
      new ApiError("VALIDATION_ERROR", 400, "Unit is not pending verification"),
    );
  }

  // Placeholder for evidence upload
  unit.evidenceUrls = evidenceUrls || [];

  if (action === "APPROVE") {
    unit.status = "ACTIVE";
  } else if (action === "REJECT") {
    unit.status = "DRAFT";
  } else {
    return next(new ApiError("VALIDATION_ERROR", 400, "Invalid action"));
  }
  await unit.save();
  res.json({ data: unit });
};
