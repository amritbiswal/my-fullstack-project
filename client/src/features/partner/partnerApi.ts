import { api } from "../../api/client";
import type { ApiSuccess } from "../../api/types";
import type { PartnerScanResult, PartnerScanStartResponse } from "./partnerTypes";

export async function startPartnerScan(token: string): Promise<PartnerScanStartResponse> {
  const res = await api.post<ApiSuccess<PartnerScanStartResponse>>("/api/partner/scan", { token });
  return res.data.data;
}

export async function getPartnerScanResult(scanId: string): Promise<PartnerScanResult> {
  const res = await api.get<ApiSuccess<PartnerScanResult>>(`/api/partner/scan/${scanId}/result`);
  return res.data.data;
}
