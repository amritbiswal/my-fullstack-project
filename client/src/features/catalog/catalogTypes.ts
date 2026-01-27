export type City = { _id: string; name: string; countryCode?: string };
export type Category = { _id: string; name: string; slug?: string };

export type PlatformSku = {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  pricePerDay: number;
  depositAmount?: number;
  transactionMode: "MANAGED_RENTAL" | "VERIFIED_ONLY";
  deliveryAllowed: boolean;
  verificationRequired: boolean;
  availableCount: number;
};
