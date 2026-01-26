import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005",
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

export function getAccessToken() {
  return accessToken || localStorage.getItem("accessToken");
}

api.interceptors.request.use((config: any) => {
  const token = getAccessToken();
  if (token)
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

export default api;
