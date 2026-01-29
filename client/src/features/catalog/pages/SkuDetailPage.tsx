import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrip } from "../../trip/TripContext";
import { useSkuDetail } from "../hooks";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/format";

// ...existing imports...

export function SkuDetailPage() {
  const { skuId } = useParams();
  const nav = useNavigate();
  const { cityId, startDate, endDate } = useTrip();

  const params = useMemo(
    () => ({ cityId, startDate, endDate }),
    [cityId, startDate, endDate],
  );
  const sku = useSkuDetail(skuId, params);

  if (sku.isLoading) return <Skeleton className="h-64" />;
  if (!sku.data) return <Card className="p-4">Item not found.</Card>;

  const s = sku.data;
  const availabilityTone = s.availableCount > 0 ? "teal" : "red";

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">{s.name}</div>
        {s.description && (
          <div className="mt-1 text-sm text-slate-600">{s.description}</div>
        )}

        {/* Image section */}
        {s.images && s.images.length > 0 && (
          <div className="my-4 flex justify-center">
            <img
              src={s.images[0]}
              alt={s.name}
              className="rounded-xl object-cover max-h-60 w-full max-w-md border"
              style={{ background: "#f3f4f6" }}
            />
          </div>
        )}

        {/* Details section */}
        <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="text-slate-500">Category</div>
          <div className="font-medium text-slate-800 truncate">
            {s.categoryId}
          </div>

          <div className="text-slate-500">SKU Slug</div>
          <div className="text-slate-800">{s.slug}</div>

          <div className="text-slate-500">Verification</div>
          <div>
            <span
              className={
                s.verificationRequired
                  ? "inline-block rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700"
                  : "inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700"
              }
            >
              {s.verificationRequired ? "Required" : "Not required"}
            </span>
          </div>

          <div className="text-slate-500">Created</div>
          {s.createdAt && (
            <div className="text-slate-800">
              {new Date(s.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="slate">{formatCurrency(s.pricePerDay)}/day</Badge>
          {s.depositAmount ? (
            <Badge tone="orange">
              {formatCurrency(s.depositAmount)} deposit
            </Badge>
          ) : null}
          <Badge tone="slate">
            {s.transactionMode === "MANAGED_RENTAL"
              ? "Managed rental"
              : "Verified-only"}
          </Badge>
          <Badge tone={availabilityTone}>
            {s.availableCount > 0
              ? `${s.availableCount} available`
              : "Not available"}
          </Badge>
          {s.deliveryAllowed ? (
            <Badge tone="teal">Delivery optional</Badge>
          ) : (
            <Badge tone="slate">Pickup only</Badge>
          )}
        </div>
      </Card>

      <div className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-[560px] px-4">
        <Card className="p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">For your trip</div>
            <div className="text-sm font-semibold">
              {startDate} → {endDate}
            </div>
          </div>
          <Button
            disabled={s.availableCount <= 0}
            onClick={() => nav(`/app/checkout/${s._id}`)}
          >
            Book
          </Button>
        </Card>
      </div>
    </div>
  );
}

// export function SkuDetailPage() {
//   const { skuId } = useParams();
//   const nav = useNavigate();
//   const { cityId, startDate, endDate } = useTrip();

//   const params = useMemo(() => ({ cityId, startDate, endDate }), [cityId, startDate, endDate]);
//   const sku = useSkuDetail(skuId, params);

//   if (sku.isLoading) return <Skeleton className="h-64" />;
//   if (!sku.data) return <Card className="p-4">Item not found.</Card>;

//   const s = sku.data;
//   const availabilityTone = s.availableCount > 0 ? "teal" : "red";

//   return (
//     <div className="space-y-3">
//       <Card className="p-4">
//         <div className="text-lg font-semibold">{s.name}</div>
//         {s.description && <div className="mt-1 text-sm text-slate-600">{s.description}</div>}

//         <div className="mt-3 flex flex-wrap gap-2">
//           <Badge tone="slate">{formatCurrency(s.pricePerDay)}/day</Badge>
//           {s.depositAmount ? <Badge tone="orange">{formatCurrency(s.depositAmount)} deposit</Badge> : null}
//           <Badge tone="slate">{s.transactionMode === "MANAGED_RENTAL" ? "Managed rental" : "Verified-only"}</Badge>
//           <Badge tone={availabilityTone}>{s.availableCount > 0 ? `${s.availableCount} available` : "Not available"}</Badge>
//           {s.deliveryAllowed ? <Badge tone="teal">Delivery optional</Badge> : <Badge tone="slate">Pickup only</Badge>}
//         </div>
//       </Card>

//       <div className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-[560px] px-4">
//         <Card className="p-3 flex items-center justify-between">
//           <div>
//             <div className="text-xs text-slate-500">For your trip</div>
//             <div className="text-sm font-semibold">{startDate} → {endDate}</div>
//           </div>
//           <Button
//             disabled={s.availableCount <= 0}
//             onClick={() => nav(`/app/checkout/${s._id}`)}
//           >
//             Book
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// }
