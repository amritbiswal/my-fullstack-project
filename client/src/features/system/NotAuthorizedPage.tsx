import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../auth/AuthContext";

export function NotAuthorizedPage() {
  const nav = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[560px] min-h-screen bg-white px-4 py-10">
        <Card className="p-5 text-center">
          <div className="text-2xl font-semibold text-slate-900">Not authorized</div>
          <div className="mt-2 text-sm text-slate-600">
            You don’t have permission to access this area.
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-left">
            <div className="text-xs text-slate-500">Signed in as</div>
            <div className="text-sm font-semibold text-slate-800">{user?.name ?? "Unknown user"}</div>
            <div className="mt-1 text-xs text-slate-600">Role: {user?.role ?? "—"}</div>
          </div>

          <div className="mt-6 space-y-2">
            <Button className="w-full" onClick={() => nav("/app/home")}>
              Go to Tourist Home
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => nav(-1)}>
              Go back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
