import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/app/EmptyState";
import { useUnits } from "../hooks";
import { UnitCard } from "../components/UnitCard";

export function ProviderInventoryListPage() {
  const nav = useNavigate();
  const q = useUnits();

  return (
    <div className="space-y-3">
      <Card className="p-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Inventory</div>
          <div className="mt-1 text-sm text-slate-600">Manage units, availability and verification.</div>
        </div>
        <Button onClick={() => nav("/provider/inventory/new")}>Add</Button>
      </Card>

      {q.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (q.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No inventory units yet"
          description="Add a unit to start renting."
          actionLabel="Add unit"
          onAction={() => nav("/provider/inventory/new")}
        />
      ) : (
        <div className="space-y-2">
          {q.data!.map((u) => (
            <UnitCard key={u._id} unit={u} />
          ))}
        </div>
      )}

      <Button variant="secondary" className="w-full" onClick={() => nav("/provider/onboarding")}>
        Provider profile
      </Button>
    </div>
  );
}
