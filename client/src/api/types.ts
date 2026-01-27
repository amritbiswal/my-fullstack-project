export type Role =
  | "TOURIST"
  | "PROVIDER_INDIVIDUAL"
  | "PROVIDER_BUSINESS"
  | "STAFF_VERIFIER"
  | "PARTNER"
  | "DELIVERY_PARTNER"
  | "ADMIN";

export type ApiSuccess<T> = { data: T; meta?: any };
export type ApiFailure = { error: { code: string; message: string; details?: any } };

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export function isApiFailure(x: any): x is ApiFailure {
  return x && typeof x === "object" && "error" in x;
}
