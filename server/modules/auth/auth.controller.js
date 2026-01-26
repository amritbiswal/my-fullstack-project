const { register, login, getMe } = require("./auth.service");
const { registerSchema, loginSchema } = require("./auth.schemas");
const { validateBody } = require("../../middlewares/validate.middleware");
const asyncHandler = require("../../error-handling/asyncHandler");

exports.register = [
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const data = await register(req.body);
    res.status(201).json({ data });
  })
];

exports.login = [
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const data = await login(req.body);
    res.json({ data });
  })
];

exports.me = [
  asyncHandler(async (req, res) => {
    const data = await getMe(req.user.userId);
    res.json({ data });
  })
];