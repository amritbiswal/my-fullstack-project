export type ScanStatus =
  | "WAITING_FOR_CONSENT"
  | "APPROVED"
  | "DENIED"
  | "EXPIRED"
  | "INVALID"
  | "ERROR";

export type PartnerScanStartResponse = {
  scanId: string;
  status?: ScanStatus;
  preview?: {
    // keep this minimal (privacy-first)
    displayName?: string;
    countryCode?: string;
    tier?: string;
  };
};

export type VerifiedPayload = {
  // Only what partner needs; adjust to your backend response
  userId: string;
  displayName: string;
  verifiedAt: string;
  tier?: string;
  // Optional fields:
  photoUrl?: string;
  dobVerified?: boolean;
  idVerified?: boolean;
};

export type PartnerScanResult = {
  scanId: string;
  status: ScanStatus;
  payload?: VerifiedPayload; // present only if APPROVED
  reason?: string;          // if denied/expired/invalid
};
