const SourcingRequest = require("../../models/SourcingRequest.model");
const SourcingDecision = require("../../models/SourcingDecision.model");
const PlatformSKU = require("../../models/PlatformSKU.model");
const ApiError = require("../../error-handling/ApiError");

// Admin approves/rejects an offer, can create SKU if needed
exports.decideOffer = async (req, res, next) => {
  const { offerId } = req.params;
  const { action, skuData, adminNotes } = req.body; // action: "APPROVE" or "REJECT"
  const offer = await SourcingDecision.findById(offerId);
  if (!offer) return next(new ApiError("NOT_FOUND", 404, "Offer not found"));

  if (action === "APPROVE") {
    offer.status = "APPROVED";
    if (skuData) {
      // Create new SKU in catalog
      const sku = await PlatformSKU.create(skuData);
      offer.adminNotes = `SKU created: ${sku._id}`;
    }
  } else if (action === "REJECT") {
    offer.status = "REJECTED";
    offer.adminNotes = adminNotes || "Rejected by admin";
  } else {
    return next(new ApiError("VALIDATION_ERROR", 400, "Invalid action"));
  }
  await offer.save();

  // Mark request as fulfilled if approved
  if (action === "APPROVE") {
    await SourcingRequest.findByIdAndUpdate(offer.requestId, { status: "FULFILLED" });
  }
  res.json({ data: offer });
};