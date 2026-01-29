export type Category = {
  _id: string;
  name: string;
  slug?: string;
  icon?: string; // optional
  createdAt?: string;
};

export type TransactionMode = "MANAGED_RENTAL" | "VERIFIED_ONLY";

export type Sku = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  images?: string[];
  pricePerDay: number;
  depositAmount?: number;
  transactionMode: TransactionMode;
  deliveryAllowed: boolean;
  verificationRequired: boolean;
  createdAt?: string;
};
