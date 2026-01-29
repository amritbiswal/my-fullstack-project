import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import type { InventoryUnit } from "../providerTypes";

function tone(status: string) {
  if (status === "ACTIVE") return "teal";
  if (status === "PENDING_VERIFICATION") return "orange";
  if (status === "BLOCKED") return "red";
  return "slate";
}

export function UnitCard({ unit }: { unit: InventoryUnit }) {
  const nav = useNavigate();
  const img = unit.photos?.[0];

  return (
    <button className="w-full text-left" onClick={() => nav(`/provider/inventory/${unit._id}`)}>
      <Card className="p-3">
        <div className="flex gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            {img ? <img src={img} alt={unit.title ?? "Unit"} className="h-full w-full object-cover" /> : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">
              {unit.title?.trim() ? unit.title : `Unit • ${unit._id.slice(-6)}`}
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Condition: {unit.condition} • SKU: {unit.skuId.slice(-6)}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={tone(unit.status) as any}>{unit.status}</Badge>
              {unit.deliveryOptions?.providerDelivery ? <Badge tone="teal">Delivery</Badge> : <Badge tone="slate">Pickup</Badge>}
              {unit.verification?.verified ? <Badge tone="teal">Verified</Badge> : <Badge tone="slate">Not verified</Badge>}
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
