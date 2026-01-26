const { z } = require("zod");

const schema = z.object({
  providerType: z.enum(["INDIVIDUAL", "BUSINESS"]),
  businessName: z.string().min(1).optional(),
  displayName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  service: z.object({
    cityIds: z.array(z.string()).optional(),
    zoneIds: z.array(z.string()).optional(),
    radiusKm: z.number().optional(),
  }).optional(),
  onboardingStatus: z.enum(["DRAFT", "SUBMITTED", "ACTIVE", "SUSPENDED"]).optional(),
  verified: z.boolean().optional(),
}).refine(data => data.providerType === "INDIVIDUAL" || (data.providerType === "BUSINESS" && data.businessName), {
  message: "businessName required for BUSINESS providerType",
  path: ["businessName"],
});

module.exports = { providerProfileSchema: schema };