import axios from "axios";
import { isApiFailure } from "./types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005",
  headers: { "Content-Type": "application/json" }
});

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (isApiFailure(data)) return data.error.message;
    if (typeof data?.message === "string") return data.message;
    return err.message || "Request failed";
  }
  return "Something went wrong";
}
