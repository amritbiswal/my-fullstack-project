import { useNavigate } from "react-router-dom";
import { useTrip } from "../../trip/TripContext";
import { useCategories, useSkus } from "../hooks";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/app/EmptyState";
import { SkuCard } from "../components/SkuCard";

export function HomePage() {
  const nav = useNavigate();
  const { cityId, startDate, endDate } = useTrip();

  const categories = useCategories({ cityId: cityId ?? undefined, startDate: startDate ?? undefined, endDate: endDate ?? undefined });
  const skus = useSkus({
    cityId,
    startDate,
    endDate,
    page: 1,
    limit: 10,
    sort: "newest"
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-lg font-semibold">Rent what you need, at your destination</div>
        <div className="mt-1 text-sm text-slate-600">
          Browse verified inventory for your selected dates.
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm"
            onClick={() => nav("/app/search")}
          >
            <div className="text-sm font-semibold">Search items</div>
            <div className="text-xs text-slate-600">Clothes, gear, gadgets</div>
          </button>
          <button
            className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm"
            onClick={() => nav("/app/trip")}
          >
            <div className="text-sm font-semibold">Change trip</div>
            <div className="text-xs text-slate-600">City & dates</div>
          </button>
        </div>
      </Card>

      <div className="px-1 text-sm font-semibold text-slate-800">Categories</div>
      {categories.isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (categories.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No categories available"
          description="Try changing dates or city."
          actionLabel="Change trip"
          onAction={() => nav("/app/trip")}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.data!.map((c) => (
            <button
              key={c._id}
              className="rounded-2xl border border-slate-100 bg-white px-3 py-4 text-left shadow-sm"
              onClick={() => nav(`/app/categories/${c._id}`)}
            >
              <div className="text-sm font-semibold">{c.name}</div>
              <div className="mt-1 text-xs text-slate-500">Explore</div>
            </button>
          ))}
        </div>
      )}

      <div className="px-1 text-sm font-semibold text-slate-800">Recommended</div>
      {skus.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (skus.data?.items.length ?? 0) === 0 ? (
        <EmptyState title="No items available" description="Try different dates or city." />
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
