import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../contexts/AuthContext";

type Role = User["role"];
interface Props {
  allowedRoles?: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-2xl font-bold mb-2">Not authorized</div>
        <div className="text-gray-500">You do not have access to this page.</div>
      </div>
    );
  }

  return <>{children}</>;
}