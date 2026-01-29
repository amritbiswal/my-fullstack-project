import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAvailability,
  createUnit,
  deleteAvailability,
  getAvailability,
  getProviderProfile,
  getUnit,
  listUnits,
  submitUnit,
  updateUnit,
  upsertProviderProfile
} from "./providerApi";

export function useProviderProfile() {
  return useQuery({ queryKey: ["provider", "profile"], queryFn: getProviderProfile });
}

export function useUpsertProviderProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertProviderProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["provider", "profile"] })
  });
}

export function useUnits() {
  return useQuery({ queryKey: ["provider", "units"], queryFn: listUnits });
}

export function useUnit(unitId?: string) {
  return useQuery({
    queryKey: ["provider", "units", unitId],
    queryFn: () => getUnit(unitId!),
    enabled: Boolean(unitId)
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["provider", "units"] })
  });
}

export function useUpdateUnit(unitId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => updateUnit(unitId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider", "units"] });
      qc.invalidateQueries({ queryKey: ["provider", "units", unitId] });
    }
  });
}

export function useSubmitUnit(unitId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => submitUnit(unitId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider", "units"] });
      qc.invalidateQueries({ queryKey: ["provider", "units", unitId] });
    }
  });
}

export function useAvailability(unitId?: string) {
  return useQuery({
    queryKey: ["provider", "availability", unitId],
    queryFn: () => getAvailability(unitId!),
    enabled: Boolean(unitId)
  });
}

export function useAddAvailability(unitId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => addAvailability(unitId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["provider", "availability", unitId] })
  });
}

export function useDeleteAvailability(unitId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (availabilityId: string) => deleteAvailability(availabilityId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["provider", "availability", unitId] })
  });
}
