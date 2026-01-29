import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySchema, type AvailabilityForm } from "../schemas";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useAddAvailability, useAvailability, useDeleteAvailability } from "../hooks";
import { useToast } from "../../../components/ui/Toast";

export function AvailabilityEditor({ unitId }: { unitId: string }) {
  const { toast } = useToast();
  const q = useAvailability(unitId);
  const add = useAddAvailability(unitId);
  const del = useDeleteAvailability(unitId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { startDate: "", endDate: "", note: "" }
  });

  async function onSubmit(values: AvailabilityForm) {
    try {
      await add.mutateAsync({ ...values, note: values.note?.trim() || undefined });
      toast("Availability added");
      reset();
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Failed to add availability", "error");
    }
  }

  async function onDelete(id: string) {
    try {
      await del.mutateAsync(id);
      toast("Availability removed");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Failed to remove", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-sm font-semibold">Add availability window</div>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start" type="date" error={errors.startDate?.message} {...register("startDate")} />
            <Input label="End" type="date" error={errors.endDate?.message} {...register("endDate")} />
          </div>
          <Input label="Note (optional)" error={errors.note?.message} {...register("note")} />
          <Button className="w-full" type="submit" disabled={isSubmitting || add.isPending}>
            {add.isPending ? "Adding..." : "Add window"}
          </Button>
        </form>
      </Card>

      <div className="px-1 text-sm font-semibold text-slate-800">Existing windows</div>

      {q.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (q.data?.length ?? 0) === 0 ? (
        <Card className="p-4 text-sm text-slate-600">No availability windows yet.</Card>
      ) : (
        <div className="space-y-2">
          {q.data!.map((w) => (
            <Card key={w._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    {String(w.startDate).slice(0, 10)} → {String(w.endDate).slice(0, 10)}
                  </div>
                  {w.note ? <div className="mt-1 text-xs text-slate-600">{w.note}</div> : null}
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="slate">Window</Badge>
                  <Button variant="secondary" size="sm" onClick={() => onDelete(w._id)} disabled={del.isPending}>
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
