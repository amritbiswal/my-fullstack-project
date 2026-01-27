import { useMemo, useState } from "react";
import { useTrip } from "../../trip/TripContext";
import { useSkus } from "../hooks";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/app/EmptyState";
import { SkuCard } from "../components/SkuCard";

export function SearchPage() {
  const { cityId, startDate, endDate } = useTrip();
  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [deliveryAllowed, setDeliveryAllowed] = useState<boolean | null>(null);

  const params = useMemo(() => {
    const p: any = { cityId, startDate, endDate, q: q.trim() || undefined, page: 1, limit: 20 };
    if (minPrice) p.minPrice = Number(minPrice);
    if (maxPrice) p.maxPrice = Number(maxPrice);
    if (deliveryAllowed !== null) p.deliveryAllowed = deliveryAllowed;
    return p;
  }, [cityId, startDate, endDate, q, minPrice, maxPrice, deliveryAllowed]);

  const skus = useSkus(params);

  return (
    <div className="space-y-3">
      <Card className="p-4 space-y-3">
        <Input label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="speaker, jacket, stroller..." />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Min price/day" inputMode="numeric" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <Input label="Max price/day" inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button
            variant={deliveryAllowed === true ? "primary" : "secondary"}
            onClick={() => setDeliveryAllowed(true)}
            className="flex-1"
          >
            Delivery
          </Button>
          <Button
            variant={deliveryAllowed === false ? "primary" : "secondary"}
            onClick={() => setDeliveryAllowed(false)}
            className="flex-1"
          >
            Pickup
          </Button>
          <Button
            variant={deliveryAllowed === null ? "primary" : "secondary"}
            onClick={() => setDeliveryAllowed(null)}
            className="flex-1"
          >
            Any
          </Button>
        </div>
      </Card>

      {skus.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (skus.data?.items.length ?? 0) === 0 ? (
        <EmptyState title="No results" description="Try a different keyword or broaden filters." />
      ) : (
        <div className="space-y-2">
          {skus.data!.items.map((s) => (
            <SkuCard key={s._id} sku={s} />
          ))}
        </div>
      )}
    </div>
  );
}
