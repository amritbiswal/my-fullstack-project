import { api } from "../../api/client";
import type { ApiSuccess } from "../../api/types";
import type { Category, City, PlatformSku } from "./catalogTypes";

export async function fetchCities(): Promise<City[]> {
  const res = await api.get<ApiSuccess<City[]>>("/api/public/cities");
  return res.data.data;
}

export async function fetchCategories(params: { cityId: string; startDate: string; endDate: string }): Promise<Category[]> {
  const res = await api.get<ApiSuccess<Category[]>>("/api/public/categories", { params });
  return res.data.data;
}

export async function fetchSkus(params: Record<string, any>): Promise<{ items: PlatformSku[]; meta?: any }> {
  const res = await api.get<ApiSuccess<PlatformSku[]>>("/api/public/skus", { params });
  return { items: res.data.data, meta: res.data.meta };
}

export async function fetchSkuDetail(skuId: string, params: Record<string, any>): Promise<PlatformSku> {
  const res = await api.get<ApiSuccess<PlatformSku>>(`/api/public/skus/${skuId}`, { params });
  return res.data.data;
}
