import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { useUnits } from "../hooks";

export function ProviderDashboardPage() {
  const nav = useNavigate();
  const units = useUnits();

  const active = (units.data ?? []).filter((u) => u.status === "ACTIVE").length;
  const pending = (units.data ?? []).filter((u) => u.status === "PENDING_VERIFICATION").length;

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Provider dashboard</div>
        <div className="mt-1 text-sm text-slate-600">
          Quick view of your inventory and verification status.
        </div>

        <div className="mt-3 flex gap-2">
          <Badge tone="teal">Active: {active}</Badge>
          <Badge tone="orange">Pending: {pending}</Badge>
          <Badge tone="slate">Total: {(units.data ?? []).length}</Badge>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Button className="w-full" onClick={() => nav("/provider/inventory")}>
          Go to inventory
        </Button>
        <Button className="w-full" variant="secondary" onClick={() => nav("/provider/inventory/new")}>
          Add unit
        </Button>
        <Button className="w-full" variant="secondary" onClick={() => nav("/provider/onboarding")}>
          Business Profile
        </Button>
      </Card>
    </div>
  );
}
