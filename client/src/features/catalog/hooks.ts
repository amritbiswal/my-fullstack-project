import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchCities, fetchSkuDetail, fetchSkus } from "./catalogApi";

export function useCities() {
  return useQuery({ queryKey: ["cities"], queryFn: fetchCities });
}

export function useCategories(params: { cityId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => fetchCategories(params as any),
    enabled: Boolean(params.cityId && params.startDate && params.endDate)
  });
}

export function useSkus(params: Record<string, any>) {
  return useQuery({
    queryKey: ["skus", params],
    queryFn: () => fetchSkus(params),
    enabled: Boolean(params.cityId && params.startDate && params.endDate)
  });
}

export function useSkuDetail(skuId?: string, params?: Record<string, any>) {
  return useQuery({
    queryKey: ["sku", skuId, params],
    queryFn: () => fetchSkuDetail(skuId!, params!),
    enabled: Boolean(skuId && params?.cityId && params?.startDate && params?.endDate)
  });
}
