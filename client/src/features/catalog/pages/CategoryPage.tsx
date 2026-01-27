import { useParams } from "react-router-dom";
import { useTrip } from "../../trip/TripContext";
import { useSkus } from "../hooks";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/app/EmptyState";
import { SkuCard } from "../components/SkuCard";

export function CategoryPage() {
  const { categoryId } = useParams();
  const { cityId, startDate, endDate } = useTrip();

  const skus = useSkus({
    cityId,
    startDate,
    endDate,
    categoryId,
    page: 1,
    limit: 30
  });

  if (skus.isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if ((skus.data?.items.length ?? 0) === 0) {
    return <EmptyState title="No items in this category" description="Try different dates or browse Search." />;
  }

  return (
    <div className="space-y-2">
      {skus.data!.items.map((s) => (
        <SkuCard key={s._id} sku={s} />
      ))}
    </div>
  );
}
