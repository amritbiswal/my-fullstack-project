import { z } from "zod";

export const providerProfileSchema = z.object({
  providerType: z.enum(["INDIVIDUAL", "BUSINESS"]),
  businessName: z.string().optional().or(z.literal("")),
  displayName: z.string().min(2, "Display name is required"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  service: z.object({
    cityIds: z.array(z.string()).min(1, "Select at least one city"),
    zoneIds: z.array(z.string()).default([]),
    radiusKm: z.coerce.number().min(1).max(200).optional()
  }),
  onboardingStatus: z.enum(["DRAFT", "SUBMITTED", "ACTIVE", "SUSPENDED"]).default("DRAFT")
}).refine(
  (v) => (v.providerType === "BUSINESS" ? Boolean(v.businessName && v.businessName.trim()) : true),
  { message: "Business name is required for business providers", path: ["businessName"] }
);

export type ProviderProfileForm = z.infer<typeof providerProfileSchema>;

export const unitSchema = z.object({
  skuId: z.string().min(1, "SKU is required"),
  cityId: z.string().min(1, "City is required"),
  title: z.string().optional().or(z.literal("")),
  condition: z.enum(["NEW", "EXCELLENT", "GOOD", "FAIR"]).default("GOOD"),
  photos: z.array(z.string()).default([]),
  deliveryOptions: z.object({
    pickup: z.boolean().default(true),
    providerDelivery: z.boolean().default(false)
  }).default({ pickup: true, providerDelivery: false })
});

export type UnitForm = z.infer<typeof unitSchema>;

export const availabilitySchema = z.object({
  startDate: z.string().min(10, "Start date required"),
  endDate: z.string().min(10, "End date required"),
  note: z.string().optional().or(z.literal(""))
});
export type AvailabilityForm = z.infer<typeof availabilitySchema>;
