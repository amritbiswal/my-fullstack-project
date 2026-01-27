import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export function ProfilePage() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-base font-semibold">{user?.name}</div>
        <div className="mt-1 text-sm text-slate-600">{user?.email ?? user?.phone ?? "—"}</div>
        <div className="mt-2 text-xs text-slate-500">Role: {user?.role}</div>
      </Card>

      <Button className="w-full" onClick={() => nav("/app/profile/pass")}>
        Packless Pass (QR)
      </Button>

      <Button variant="secondary" className="w-full" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
