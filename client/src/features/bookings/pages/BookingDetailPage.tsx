import { useParams } from "react-router-dom";
import { useBooking, useCancelBooking } from "../hooks";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";

const timeline: Array<{ key: string; label: string }> = [
  { key: "PENDING_CONFIRMATION", label: "Pending confirmation" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "IN_USE", label: "In use" },
  { key: "RETURN_VERIFIED", label: "Return verified" },
  { key: "CLOSED", label: "Closed" }
];

export function BookingDetailPage() {
  const { bookingId } = useParams();
  const { toast } = useToast();
  const q = useBooking(bookingId);
  const cancel = useCancelBooking();

  if (q.isLoading) return <Skeleton className="h-48" />;
  if (!q.data) return <Card className="p-4">Booking not found.</Card>;

  const b = q.data;
  const canCancel = b.status === "CONFIRMED" || b.status === "PENDING_CONFIRMATION";

  async function onCancel() {
    try {
      await cancel.mutateAsync(b._id);
      toast("Booking cancelled");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Cancel failed", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">Booking #{b._id.slice(-6)}</div>
            <div className="mt-1 text-xs text-slate-600">{b.startDate} → {b.endDate}</div>
          </div>
          <Badge tone="slate">{b.status}</Badge>
        </div>

        <div className="mt-4 space-y-2">
          {timeline.map((t) => (
            <div key={t.key} className="flex items-center justify-between">
              <div className="text-sm">{t.label}</div>
              <div className="text-xs text-slate-500">
                {b.status === t.key ? "Current" : ""}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {canCancel && (
        <Button variant="secondary" className="w-full" onClick={onCancel} disabled={cancel.isPending}>
          {cancel.isPending ? "Cancelling..." : "Cancel booking"}
        </Button>
      )}
    </div>
  );
}
