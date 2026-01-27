import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
// import type { JSX } from "react/jsx-dev-runtime";

export default function RoleRoute({ allowedRoles, children }: { allowedRoles: string[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) return null;
  return children;
}