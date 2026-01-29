const ProviderProfile = require("../../models/ProviderProfile.model");
const { ApiError } = require("../../error-handling/ApiError");

// GET /api/provider/profile
exports.getProfile = async (req, res) => {
  const profile = await ProviderProfile.findOne({ userId: req.user.userId });
  res.json({ data: profile || null });
};

// PUT /api/provider/profile
exports.upsertProfile = async (req, res, next) => {
  const data = req.body;
  data.userId = req.user.userId;
  let profile = await ProviderProfile.findOne({ userId: req.user.userId });
  if (profile) {
    Object.assign(profile, data);
    await profile.save();
  } else {
    profile = await ProviderProfile.create(data);
  }
  res.json({ data: profile });
};

// exports.createOrUpdate = async (req, res, next) => {
//   const { businessName, contact, type } = req.body;
//   let profile = await ProviderProfile.findOne({ userId: req.user.id });
//   if (profile) {
//     profile.businessName = businessName;
//     profile.contact = contact;
//     profile.type = type;
//     await profile.save();
//   } else {
//     profile = await ProviderProfile.create({
//       userId: req.user.id,
//       businessName,
//       contact,
//       type,
//       verified: false,
//     });
//   }
//   res.json({ data: profile });
// };

// exports.getMyProfile = async (req, res, next) => {
//   const profile = await ProviderProfile.findOne({ userId: req.user.id });
//   if (!profile) return next(new ApiError("NOT_FOUND", 404, "Profile not found"));
//   res.json({ data: profile });
// };
