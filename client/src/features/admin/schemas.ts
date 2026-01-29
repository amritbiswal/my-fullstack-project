import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(slugRegex, "Use lowercase letters, numbers and hyphens only"),
  icon: z.string().optional().or(z.literal("")),
});

export type CreateCategoryForm = z.infer<typeof createCategorySchema>;

export const createSkuSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(slugRegex, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),

  // ✅ make it always an array in the schema output even if undefined comes in
  images: z.array(z.string()).catch([]),

  pricePerDay: z.coerce.number().min(1, "Price/day must be > 0"),
  depositAmount: z.coerce.number().min(0).optional(),
  transactionMode: z.enum(["MANAGED_RENTAL", "VERIFIED_ONLY"]),
  deliveryAllowed: z.coerce.boolean().default(true),
  verificationRequired: z.coerce.boolean().default(true),
});

export type CreateSkuForm = z.infer<typeof createSkuSchema>;
