import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "../api/types";

export function ProtectedRoute() {
  const { user, isBootstrapping } = useAuth();
  if (isBootstrapping) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RoleRoute({ allowed }: { allowed: Role[] }) {
  const { user, isBootstrapping } = useAuth();
  if (isBootstrapping) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/not-authorized" replace />;
  return <Outlet />;
}
