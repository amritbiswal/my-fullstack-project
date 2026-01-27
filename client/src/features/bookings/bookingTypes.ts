export type BookingStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "HANDOFF_VERIFIED"
  | "IN_USE"
  | "RETURN_PENDING_VERIFICATION"
  | "RETURN_VERIFIED"
  | "CLOSED"
  | "CANCELLED"
  | "REJECTED"
  | "DISPUTE_OPEN";

export type Booking = {
  _id: string;
  cityId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  transactionMode: "MANAGED_RENTAL" | "VERIFIED_ONLY";
  pricing?: { subtotal?: number; deposit?: number; fees?: number; total?: number };
  createdAt?: string;
};

export type CreateBookingInput = {
  skuId: string;
  cityId: string;
  startDate: string;
  endDate: string;
  deliveryOption: "PICKUP" | "PROVIDER_DELIVERY";
  deliveryAddress?: {
    line1: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  notes?: string;
};
