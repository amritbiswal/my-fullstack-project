const { z } = require("zod");

const inventoryUnitSchema = z.object({
  skuId: z.string().min(1),
  cityId: z.string().min(1),
  zoneId: z.string().optional(),
  title: z.string().optional(),
  photos: z.array(z.string()).optional(),
  condition: z.enum(["NEW", "EXCELLENT", "GOOD", "FAIR"]),
  deliveryOptions: z.object({
    pickup: z.boolean().optional(),
    providerDelivery: z.boolean().optional()
  }).optional()
});

module.exports = { inventoryUnitSchema };