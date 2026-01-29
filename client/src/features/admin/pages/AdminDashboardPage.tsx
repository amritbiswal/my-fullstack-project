import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export function AdminDashboardPage() {
  const nav = useNavigate();

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Admin dashboard</div>
        <div className="mt-1 text-sm text-slate-600">
          Manage catalog structure, platform inventory SKUs, staff, and provider
          operations.
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="teal">Catalog</Badge>
          <Badge tone="slate">Governance</Badge>
          <Badge tone="teal">Staff</Badge>
          <Badge tone="slate">Providers</Badge>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <Button
          className="w-full"
          onClick={() => nav("/admin/catalog/categories")}
        >
          Manage categories
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => nav("/admin/catalog/skus")}
        >
          Manage SKUs
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => nav("/staff/queue")}
        >
          Staff queue
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => nav("/provider/dashboard")}
        >
          Provider dashboard
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => nav("/provider/inventory")}
        >
          Provider inventory
        </Button>
      </Card>
    </div>
  );
}
