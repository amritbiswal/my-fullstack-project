import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api/client";
import type { Role } from "../api/types";

type User = { id: string; name: string; email?: string | null; phone?: string | null; role: Role };
type AuthState = {
  user: User | null;
  token: string | null;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email?: string; phone?: string; password: string; role: Role }) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

const LS_KEY = "packless_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(LS_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    async function bootstrap() {
      try {
        if (!token) return;
        const res = await api.get("/api/auth/me");
        setUser(res.data.data);
      } catch {
        localStorage.removeItem(LS_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }
    bootstrap();
    if (!token) setIsBootstrapping(false);
  }, [token]);

  async function login(email: string, password: string) {
    const res = await api.post("/api/auth/login", { email, password });
    const nextToken = res.data.data.accessToken as string;
    localStorage.setItem(LS_KEY, nextToken);
    setToken(nextToken);
    setUser(res.data.data.user);
  }

  async function register(payload: { name: string; email?: string; phone?: string; password: string; role: Role }) {
    const res = await api.post("/api/auth/register", payload);
    const nextToken = res.data.data.accessToken as string;
    localStorage.setItem(LS_KEY, nextToken);
    setToken(nextToken);
    setUser(res.data.data.user);
  }

  function logout() {
    localStorage.removeItem(LS_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo<AuthState>(
    () => ({ user, token, isBootstrapping, login, register, logout }),
    [user, token, isBootstrapping]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
