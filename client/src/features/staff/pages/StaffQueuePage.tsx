import { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/app/EmptyState";
import { TaskCard } from "../components/TaskCard";
import { useStaffQueue } from "../hooks";
import { api } from "../../../api/client";
import { useQuery } from "@tanstack/react-query";

export function StaffQueuePage() {
  const [cityId, setCityId] = useState("");
  const [type, setType] = useState<string>("UNIT_ONBOARDING");
  const [status, setStatus] = useState<string>("PENDING");

  const cities = useQuery({
    queryKey: ["cities"],
    queryFn: async () => (await api.get("/api/public/cities")).data.data
  });

  const params = useMemo(
    () => ({ cityId: cityId.trim(), type, status, page: 1, limit: 25 }),
    [cityId, type, status]
  );

  const q = useStaffQueue({ cityId: params.cityId || undefined, type, status, page: 1, limit: 25 });

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Verification queue</div>
        <div className="mt-1 text-sm text-slate-600">
          Claim tasks, verify unit condition, then approve/reject to unlock tourist bookings.
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <label className="block">
          <div className="mb-1 text-sm font-medium text-slate-700">City</div>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={cities.isLoading}
          >
            <option value="" disabled>
              {cities.isLoading ? "Loading cities..." : "Select city"}
            </option>
            {cities.data?.map((city: any) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">Type</div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="UNIT_ONBOARDING">UNIT_ONBOARDING</option>
              <option value="PRE_HANDOFF">PRE_HANDOFF</option>
              <option value="POST_RETURN">POST_RETURN</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">Status</div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </label>
        </div>

        <Button variant="secondary" className="w-full" onClick={() => q.refetch()} disabled={!cityId.trim()}>
          Refresh
        </Button>
      </Card>

      {q.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (q.data?.items.length ?? 0) === 0 ? (
        <EmptyState title="No tasks found" description="Try another city/type/status filter." />
      ) : (
        <div className="space-y-2">
          {q.data!.items.map((t) => (
            <TaskCard key={t._id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
}
