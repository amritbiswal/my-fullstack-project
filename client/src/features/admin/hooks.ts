import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminCategory,
  createAdminSku,
  deleteAdminCategory,
  deleteAdminSku,
  listAdminCategories,
  listAdminSkus,
  updateAdminCategory,
  updateAdminSku
} from "./adminApi";

export function useAdminCategories() {
  return useQuery({ queryKey: ["admin", "categories"], queryFn: listAdminCategories });
}

export function useCreateAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] })
  });
}

export function useUpdateAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => updateAdminCategory(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] })
  });
}

export function useDeleteAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] })
  });
}

export function useAdminSkus() {
  return useQuery({ queryKey: ["admin", "skus"], queryFn: listAdminSkus });
}

export function useCreateAdminSku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminSku,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "skus"] })
  });
}

export function useUpdateAdminSku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => updateAdminSku(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "skus"] })
  });
}

export function useDeleteAdminSku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminSku(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "skus"] })
  });
}
