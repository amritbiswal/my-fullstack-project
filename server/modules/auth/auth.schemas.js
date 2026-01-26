const { z } = require("zod");

const USER_ROLES = [
  "TOURIST",
  "PROVIDER_INDIVIDUAL",
  "PROVIDER_BUSINESS",
];

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(USER_ROLES)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

module.exports = { registerSchema, loginSchema };