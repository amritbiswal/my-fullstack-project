const City = require("../../models/City.model");
const Zone = require("../../models/Zone.model");

// GET /api/public/cities
exports.listCities = async (req, res) => {
  const cities = await City.find({ active: true });
  res.json({ data: cities });
};

// GET /api/public/zones?cityId=...
exports.listZones = async (req, res, next) => {
  const { cityId } = req.query;
  const query = { active: true };
  if (cityId) query.cityId = cityId;
  const zones = await Zone.find(query);
  res.json({ data: zones });
};