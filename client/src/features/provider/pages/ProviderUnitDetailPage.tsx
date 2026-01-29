import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { AvailabilityEditor } from "../components/AvailabilityEditor";
import { useSubmitUnit, useUnit, useUpdateUnit } from "../hooks";

function statusTone(status: string) {
  if (status === "ACTIVE") return "teal";
  if (status === "PENDING_VERIFICATION") return "orange";
  if (status === "BLOCKED") return "red";
  return "slate";
}

export function ProviderUnitDetailPage() {
  const { unitId } = useParams();
  const { toast } = useToast();

  const q = useUnit(unitId);
  const update = useUpdateUnit(unitId!);
  const submit = useSubmitUnit(unitId!);

  const unit = q.data;

  const canSubmit = unit?.status === "DRAFT" || unit?.status === "SUBMITTED";
  const alreadyPending = unit?.status === "PENDING_VERIFICATION";

  const defaultTitle = useMemo(() => unit?.title ?? "", [unit?.title]);

  if (q.isLoading) return <Skeleton className="h-64" />;
  if (!unit) return <Card className="p-4">Unit not found.</Card>;

  async function onSaveTitle(newTitle: string) {
    try {
      await update.mutateAsync({ title: newTitle.trim() || undefined });
      toast("Saved");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Save failed", "error");
    }
  }

  async function onSubmitForVerification() {
    try {
      await submit.mutateAsync();
      toast("Submitted for verification");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Submit failed", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">{unit.title?.trim() ? unit.title : `Unit • ${unit._id.slice(-6)}`}</div>
            <div className="mt-1 text-xs text-slate-600">
              SKU: {unit.skuId} • City: {unit.cityId}
            </div>
          </div>
          <Badge tone={statusTone(unit.status) as any}>{unit.status}</Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-slate-700">Quick edit</div>
          <Input
            label="Title"
            defaultValue={defaultTitle}
            onBlur={(e) => onSaveTitle(e.target.value)}
          />
          <div className="text-xs text-slate-500">Tip: Title is internal label to identify the item.</div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            onClick={onSubmitForVerification}
            disabled={submit.isPending || alreadyPending || !canSubmit}
          >
            {alreadyPending ? "Pending verification" : submit.isPending ? "Submitting..." : "Submit for verification"}
          </Button>
        </div>

        {!unit.verification?.verified && (
          <div className="mt-3 text-xs text-slate-600">
            Only <span className="font-semibold">ACTIVE</span> units appear in tourist search.
          </div>
        )}
      </Card>

      <AvailabilityEditor unitId={unit._id} />
    </div>
  );
}
