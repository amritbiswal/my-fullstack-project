export type ProviderType = "INDIVIDUAL" | "BUSINESS";
export type OnboardingStatus = "DRAFT" | "SUBMITTED" | "ACTIVE" | "SUSPENDED";

export type ProviderProfile = {
  _id: string;
  userId: string;
  providerType: ProviderType;
  businessName?: string | null;
  displayName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  service: {
    cityIds: string[];
    zoneIds: string[];
    radiusKm?: number | null;
  };
  onboardingStatus: OnboardingStatus;
  verified: boolean;
};

export type UnitStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "RESERVED"
  | "IN_USE"
  | "BLOCKED"
  | "RETIRED";

export type UnitCondition = "NEW" | "EXCELLENT" | "GOOD" | "FAIR";

export type InventoryUnit = {
  _id: string;
  skuId: string;
  cityId: string;
  zoneId?: string | null;
  title?: string | null;
  photos?: string[];
  condition: UnitCondition;
  status: UnitStatus;
  deliveryOptions?: { pickup: boolean; providerDelivery: boolean };
  verification?: { verified: boolean; verifiedAt?: string; verifiedBy?: string };
  createdAt?: string;
};

export type AvailabilityWindow = {
  _id: string;
  unitId: string;
  startDate: string; // YYYY-MM-DD or ISO
  endDate: string;   // YYYY-MM-DD or ISO
  note?: string | null;
};
