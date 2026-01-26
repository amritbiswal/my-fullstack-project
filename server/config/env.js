const { z } = require("zod");

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  ORIGIN: z.string().url(),
  NODE_ENV: z.enum(["development", "production"]),
});

function validateEnv(env) {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
}

module.exports = validateEnv;