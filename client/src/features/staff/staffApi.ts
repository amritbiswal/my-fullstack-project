import { api } from "../../api/client";
import type { ApiSuccess } from "../../api/types";
import type { PendingUnit, UnitVerificationHistory, VerificationTask  } from "./staffTypes";

export async function fetchQueue(params: {
  cityId: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: VerificationTask[]; meta?: any }> {
  const res = await api.get<ApiSuccess<VerificationTask[]>>("/api/staff/queue", { params });
  return { items: res.data.data, meta: res.data.meta };
}

// Pending units by city: GET /api/staff/units/pending
export async function fetchPendingUnitsByCity(params: {
  cityId: string;
  page?: number;
  limit?: number;
}): Promise<{ items: PendingUnit[]; meta?: any }> {
  const res = await api.get<ApiSuccess<PendingUnit[]>>("/api/staff/units/pending", { params });
  return { items: res.data.data, meta: res.data.meta };
}

// Task lifecycle
export async function claimTask(taskId: string) {
  const res = await api.post<ApiSuccess<any>>(`/api/staff/${taskId}/claim`);
  return res.data.data;
}

export async function releaseTask(taskId: string) {
  const res = await api.post<ApiSuccess<any>>(`/api/staff/${taskId}/release`);
  return res.data.data;
}

// Approve/reject task => should create VerificationReport and complete task
export async function approveTask(taskId: string, payload: { checklist: any; evidence: string[]; notes?: string }) {
  const res = await api.post<ApiSuccess<any>>(`/api/staff/${taskId}/approve`, payload);
  return res.data.data;
}

export async function rejectTask(taskId: string, payload: { checklist: any; evidence: string[]; notes?: string }) {
  const res = await api.post<ApiSuccess<any>>(`/api/staff/${taskId}/reject`, payload);
  return res.data.data;
}

// Unit history
export async function fetchUnitHistory(unitId: string): Promise<UnitVerificationHistory> {
  const res = await api.get<ApiSuccess<UnitVerificationHistory>>(`/api/staff/units/${unitId}/history`);
  return res.data.data;
}

// Optional: direct unit verification shortcut (exists in backend routes)
export async function verifyUnitDirect(
  unitId: string,
  payload: { decision: "APPROVE" | "REJECT"; notes?: string; evidence?: string[]; checklist?: any }
) {
  const res = await api.post<ApiSuccess<any>>(`/api/staff/units/${unitId}/verify`, payload);
  return res.data.data;
}
