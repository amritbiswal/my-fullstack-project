import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { formatCurrency } from "../../../utils/format";
import type { PlatformSku } from "../catalogTypes";
import { useNavigate } from "react-router-dom";

export function SkuCard({ sku }: { sku: PlatformSku }) {
  const nav = useNavigate();
  const img = sku.images?.[0];

  const availabilityTone = sku.availableCount > 0 ? "teal" : "red";
  const availabilityText = sku.availableCount > 0 ? `${sku.availableCount} available` : "Not available";

  return (
    <button className="w-full text-left" onClick={() => nav(`/app/sku/${sku._id}`)}>
      <Card className="p-3">
        <div className="flex gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            {img ? <img src={img} alt={sku.name} className="h-full w-full object-cover" /> : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">{sku.name}</div>
            <div className="mt-1 text-xs text-slate-600">
              {formatCurrency(sku.pricePerDay)}/day
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={availabilityTone}>{availabilityText}</Badge>
              <Badge tone="slate">{sku.transactionMode === "MANAGED_RENTAL" ? "Managed" : "Verified-only"}</Badge>
              {sku.depositAmount ? <Badge tone="orange">Deposit</Badge> : null}
              {sku.deliveryAllowed ? <Badge tone="teal">Delivery</Badge> : <Badge tone="slate">Pickup</Badge>}
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
