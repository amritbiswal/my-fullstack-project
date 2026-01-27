import { useNavigate } from "react-router-dom";
import { useMyBookings } from "../hooks";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/app/EmptyState";

function statusTone(status: string) {
  if (status === "CONFIRMED" || status === "IN_USE") return "teal";
  if (status === "CANCELLED" || status === "REJECTED") return "red";
  return "slate";
}

export function BookingsPage() {
  const nav = useNavigate();
  const q = useMyBookings();

  if (q.isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  const bookings = q.data ?? [];
  if (bookings.length === 0) {
    return <EmptyState title="No bookings yet" description="Browse items and book what you need." actionLabel="Browse" onAction={() => nav("/app/home")} />;
  }

  return (
    <div className="space-y-2">
      {bookings.map((b) => (
        <button key={b._id} className="w-full text-left" onClick={() => nav(`/app/bookings/${b._id}`)}>
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Booking #{b._id.slice(-6)}</div>
                <div className="mt-1 text-xs text-slate-600">
                  {b.startDate} → {b.endDate}
                </div>
              </div>
              <Badge tone={statusTone(b.status) as any}>{b.status}</Badge>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}
