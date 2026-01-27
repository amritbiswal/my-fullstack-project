import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

// Fetch all cities
export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => (await api.get("/api/public/cities")).data.data,
    staleTime: 1000 * 60 * 10, // cache for 10 min
  });
}

// Fetch categories for a city
export function useCategories(cityId: string) {
  return useQuery({
    queryKey: ["categories", cityId],
    queryFn: async () => (await api.get("/api/public/categories", { params: { cityId } })).data.data,
    enabled: !!cityId,
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch SKUs with filters
export function useSkus(params: Record<string, any>) {
  return useQuery({
    queryKey: ["skus", params],
    queryFn: async () => (await api.get("/api/public/skus", { params })).data.data,
    enabled: !!params.cityId,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch SKU detail
export function useSkuDetail(id: string, params: Record<string, any>) {
  return useQuery({
    queryKey: ["sku", id, params],
    queryFn: async () => (await api.get(`/api/public/skus/${id}`, { params })).data.data,
    enabled: !!id && !!params.cityId,
    staleTime: 1000 * 60 * 5,
  });
}