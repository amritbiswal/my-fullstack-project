const { z } = require("zod");

const skuSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  images: z.array(z.string()).optional(),
  pricePerDay: z.number().min(0),
  depositAmount: z.number().min(0).optional(),
  transactionMode: z.enum(["MANAGED_RENTAL", "VERIFIED_ONLY"]),
  verificationRequired: z.boolean().optional(),
  deliveryAllowed: z.boolean().optional(),
  allowedCityIds: z.array(z.string()).optional(),
});

module.exports = { skuSchema };