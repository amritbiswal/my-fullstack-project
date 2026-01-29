import { api } from "../../api/client";
import type { ApiSuccess } from "../../api/types";
import type { Category, Sku } from "./adminTypes";

export async function listAdminCategories(): Promise<Category[]> {
  const res = await api.get<ApiSuccess<Category[]>>("/api/admin/categories");
  return res.data.data;
}

export async function createAdminCategory(payload: { name: string; slug: string; icon?: string }): Promise<Category> {
  const res = await api.post<ApiSuccess<Category>>("/api/admin/categories", payload);
  return res.data.data;
}

export async function updateAdminCategory(categoryId: string, payload: Partial<Pick<Category, "name" | "slug" | "icon">>): Promise<Category> {
  const res = await api.put<ApiSuccess<Category>>(`/api/admin/categories/${categoryId}`, payload);
  return res.data.data;
}

export async function deleteAdminCategory(categoryId: string): Promise<{ ok: true }> {
  const res = await api.delete<ApiSuccess<{ ok: true }>>(`/api/admin/categories/${categoryId}`);
  return res.data.data;
}

export async function listAdminSkus(): Promise<Sku[]> {
  const res = await api.get<ApiSuccess<Sku[]>>("/api/admin/skus");
  return res.data.data;
}

export async function createAdminSku(payload: Omit<Sku, "_id" | "createdAt">): Promise<Sku> {
  const res = await api.post<ApiSuccess<Sku>>("/api/admin/skus", payload);
  return res.data.data;
}

export async function updateAdminSku(skuId: string, payload: Partial<Omit<Sku, "_id" | "createdAt">>): Promise<Sku> {
  const res = await api.put<ApiSuccess<Sku>>(`/api/admin/skus/${skuId}`, payload);
  return res.data.data;
}

export async function deleteAdminSku(skuId: string): Promise<{ ok: true }> {
  const res = await api.delete<ApiSuccess<{ ok: true }>>(`/api/admin/skus/${skuId}`);
  return res.data.data;
}
