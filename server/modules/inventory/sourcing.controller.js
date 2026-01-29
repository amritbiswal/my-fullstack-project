const SourcingRequest = require("../../models/SourcingRequest.model");
const SourcingDecision = require("../../models/SourcingDecision.model");
const ProviderProfile = require("../../models/ProviderProfile.model");
const { ApiError } = require("../../error-handling/ApiError");

// Tourist creates a sourcing request
exports.createRequest = async (req, res, next) => {
  const { cityId, name, description } = req.body;
  if (!cityId || !name)
    return next(
      new ApiError("VALIDATION_ERROR", 400, "cityId and name required"),
    );
  const request = await SourcingRequest.create({
    userId: req.user.userId,
    cityId,
    name,
    description,
    status: "OPEN",
  });
  res.status(201).json({ data: request });
};

// List all open requests (for providers/admin)
exports.listOpen = async (req, res) => {
  const requests = await SourcingRequest.find({ status: "OPEN" }).populate(
    "cityId userId",
  );
  res.json({ data: requests });
};

// Provider submits an offer
exports.submitOffer = async (req, res, next) => {
  const { requestId, offerDetails } = req.body;
  const providerProfile = await ProviderProfile.findOne({
    userId: req.user.userId,
  });
  if (!providerProfile)
    return next(
      new ApiError("AUTH_FORBIDDEN", 403, "Provider profile required"),
    );
  const request = await SourcingRequest.findById(requestId);
  if (!request || request.status !== "OPEN")
    return next(new ApiError("NOT_FOUND", 404, "Request not open"));
  const offer = await SourcingDecision.create({
    requestId,
    providerId: providerProfile._id,
    offerDetails,
    status: "PENDING",
  });
  request.offers.push(offer._id);
  await request.save();
  res.status(201).json({ data: offer });
};
