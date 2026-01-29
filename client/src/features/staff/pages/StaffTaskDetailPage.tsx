import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import {
  useApproveTask,
  useClaimTask,
  useRejectTask,
  useReleaseTask,
  useUnitHistory,
} from "../hooks";

export function StaffTaskDetailPage() {
  const { toast } = useToast();
  const nav = useNavigate();
  const { taskId } = useParams();
  const [sp] = useSearchParams();

  const unitId = sp.get("unitId") || "";

  const claim = useClaimTask(taskId!);
  const release = useReleaseTask(taskId!);
  const approve = useApproveTask(taskId!);
  const reject = useRejectTask(taskId!);

  const history = useUnitHistory(unitId || undefined);

  const [notes, setNotes] = useState("");
  const [evidenceCsv, setEvidenceCsv] = useState("");
  const [checklist, setChecklist] = useState<Record<string, any>>({
    itemClean: true,
    fullyWorking: true,
    photosValid: true,
  });

  const evidence = useMemo(
    () =>
      evidenceCsv
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    [evidenceCsv],
  );

  if (!taskId) return <Card className="p-4">Missing taskId</Card>;

  async function onClaim() {
    try {
      await claim.mutateAsync();
      toast("Task claimed");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Claim failed", "error");
    }
  }

  async function onRelease() {
    try {
      await release.mutateAsync();
      toast("Task released");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Release failed", "error");
    }
  }

  async function onApprove() {
    if (!unitId)
      return toast("Missing unitId in URL (open from queue)", "error");
    try {
      await approve.mutateAsync({
        checklist,
        evidence,
        notes: notes.trim() || undefined,
      });
      toast("Approved. Unit should now be ACTIVE for tourists.");
      nav("/staff/queue");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Approve failed", "error");
    }
  }

  async function onReject() {
    if (!unitId)
      return toast("Missing unitId in URL (open from queue)", "error");
    try {
      await reject.mutateAsync({
        checklist,
        evidence,
        notes: notes.trim() || undefined,
      });
      toast("Rejected.");
      nav("/staff/queue");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Reject failed", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Verify unit</div>
        <div className="mt-1 text-sm text-slate-600">Task: {taskId}</div>
        <div className="mt-1 text-sm text-slate-600">Unit: {unitId || "—"}</div>

        <div className="mt-3 flex gap-2">
          <Button
            variant="secondary"
            onClick={onClaim}
            disabled={claim.isPending}
          >
            {claim.isPending ? "Claiming..." : "Claim"}
          </Button>
          <Button
            variant="secondary"
            onClick={onRelease}
            disabled={release.isPending}
          >
            {release.isPending ? "Releasing..." : "Release"}
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="text-sm font-semibold">Checklist</div>

        <div className="flex flex-col gap-2">
          {(["itemClean", "fullyWorking", "photosValid"] as const).map((k) => (
            <button
              key={k}
              type="button"
              className={`h-11 rounded-xl border px-4 text-sm font-medium text-left ${
                checklist[k]
                  ? "border-teal-300 bg-teal-50 text-teal-800"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
              onClick={() =>
                setChecklist((prev) => ({ ...prev, [k]: !prev[k] }))
              }
            >
              {k}: {checklist[k] ? "Yes" : "No"}
            </button>
          ))}
        </div>

        <Input
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Input
          label="Evidence URLs (comma-separated)"
          value={evidenceCsv}
          onChange={(e) => setEvidenceCsv(e.target.value)}
          placeholder="https://photo1, https://photo2"
        />

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onApprove}
            disabled={approve.isPending || reject.isPending}
          >
            {approve.isPending ? "Approving..." : "Approve"}
          </Button>
          <Button
            variant="secondary"
            onClick={onReject}
            disabled={approve.isPending || reject.isPending}
          >
            {reject.isPending ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-semibold">Unit history</div>
        {!unitId ? (
          <div className="mt-2 text-sm text-slate-600">
            Open this page from the queue so unitId is present.
          </div>
        ) : history.isLoading ? (
          <div className="mt-3">
            <Skeleton className="h-20" />
          </div>
        ) : !history.data ? (
          <div className="mt-2 text-sm text-slate-600">No history found.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {history.data.tasks.map((x, idx) => (
              <div key={idx} className="rounded-xl border border-slate-100 p-3">
                <div className="text-sm font-semibold">
                  {x.task
                    ? `${x.task.type} • ${x.task.status}`
                    : "Task not found"}
                </div>
                {x.report ? (
                  <div className="mt-1 text-xs text-slate-600">
                    Result: {x.report.result} • {x.report.createdAt}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-slate-600">No report</div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
