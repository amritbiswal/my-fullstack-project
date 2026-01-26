import { createContext, useEffect, useState, type ReactNode } from "react";
import api, { setAccessToken, getAccessToken } from "../api/client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (params: { email: string; password: string }) => Promise<User>;
  register: (params: { name: string; email: string; password: string; role: string }) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());

  useEffect(() => {
    const stored = getAccessToken();
    if (stored) {
      setToken(stored);
      api.get("/api/auth/me")
        .then(res => setUser(res.data.data.user))
        .catch(() => {
          setToken(null);
          setAccessToken(null);
          setUser(null);
        });
    }
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post("/api/auth/login", { email, password });
    setToken(res.data.data.accessToken);
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const register = async ({ name, email, password, role }: { name: string; email: string; password: string; role: string }) => {
    const res = await api.post("/api/auth/register", { name, email, password, role });
    setToken(res.data.data.accessToken);
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = () => {
    setToken(null);
    setAccessToken(null);
    setUser(null);
  };

  const value: AuthContextType = { user, token, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}