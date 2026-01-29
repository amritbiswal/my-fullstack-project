import { api } from "../../api/client";
import type { ApiSuccess } from "../../api/types";
import type { AvailabilityWindow, InventoryUnit, ProviderProfile } from "./providerTypes";

export async function getProviderProfile(): Promise<ProviderProfile | null> {
  const res = await api.get<ApiSuccess<ProviderProfile | null>>("/api/provider/profile");
  return res.data.data;
}

export async function upsertProviderProfile(payload: Partial<ProviderProfile>): Promise<ProviderProfile> {
  const res = await api.put<ApiSuccess<ProviderProfile>>("/api/provider/profile", payload);
  return res.data.data;
}

export async function listUnits(): Promise<InventoryUnit[]> {
  const res = await api.get<ApiSuccess<InventoryUnit[]>>("/api/provider/units");
  return res.data.data;
}

export async function getUnit(unitId: string): Promise<InventoryUnit> {
  const res = await api.get<ApiSuccess<InventoryUnit>>(`/api/provider/units/${unitId}`);
  return res.data.data;
}

export async function createUnit(payload: Partial<InventoryUnit>): Promise<InventoryUnit> {
  const res = await api.post<ApiSuccess<InventoryUnit>>("/api/provider/units", payload);
  return res.data.data;
}

export async function updateUnit(unitId: string, payload: Partial<InventoryUnit>): Promise<InventoryUnit> {
  const res = await api.put<ApiSuccess<InventoryUnit>>(`/api/provider/units/${unitId}`, payload);
  return res.data.data;
}

export async function submitUnit(unitId: string): Promise<{ unitId: string; taskId?: string; status?: string }> {
  const res = await api.post<ApiSuccess<any>>(`/api/provider/units/${unitId}/submit`);
  return res.data.data;
}

export async function getAvailability(unitId: string): Promise<AvailabilityWindow[]> {
  const res = await api.get<ApiSuccess<AvailabilityWindow[]>>(`/api/provider/units/${unitId}/availability`);
  return res.data.data;
}

export async function addAvailability(unitId: string, payload: { startDate: string; endDate: string; note?: string }): Promise<AvailabilityWindow> {
  const res = await api.post<ApiSuccess<AvailabilityWindow>>(`/api/provider/units/${unitId}/availability`, payload);
  return res.data.data;
}

export async function deleteAvailability(availabilityId: string): Promise<{ ok: true }> {
  const res = await api.delete<ApiSuccess<{ ok: true }>>(`/api/provider/availability/${availabilityId}`);
  return res.data.data;
}

// fetch cities where provider can offer services
