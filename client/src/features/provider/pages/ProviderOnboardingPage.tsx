import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { providerProfileSchema, type ProviderProfileForm } from "../schemas";
import { useProviderProfile, useUpsertProviderProfile } from "../hooks";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../trip/TripContext";

export function ProviderOnboardingPage() {
  const { toast } = useToast();
  const nav = useNavigate();
  const profile = useProviderProfile();
  const save = useUpsertProviderProfile();
  const { cityId } = useTrip(); // optional helper; provider can start with same city as trip for convenience

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProviderProfileForm>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      providerType: "INDIVIDUAL",
      businessName: "",
      displayName: "",
      phone: "",
      email: "",
      onboardingStatus: "DRAFT",
      service: { cityIds: cityId ? [cityId] : [], zoneIds: [], radiusKm: 10 }
    }
  });

  const providerType = watch("providerType");

  useEffect(() => {
    if (!profile.data) return;
    const p = profile.data;
    setValue("providerType", p.providerType);
    setValue("businessName", p.businessName ?? "");
    setValue("displayName", p.displayName ?? "");
    setValue("phone", p.phone ?? "");
    setValue("email", p.email ?? "");
    setValue("onboardingStatus", p.onboardingStatus ?? "DRAFT");
    setValue("service.cityIds", p.service?.cityIds ?? []);
    setValue("service.zoneIds", p.service?.zoneIds ?? []);
    setValue("service.radiusKm", (p.service?.radiusKm as any) ?? 10);
  }, [profile.data, setValue]);

  async function onSubmit(values: ProviderProfileForm) {
    try {
      const payload: any = {
        providerType: values.providerType,
        businessName: values.businessName?.trim() || undefined,
        displayName: values.displayName.trim(),
        phone: values.phone?.trim() || undefined,
        email: values.email?.trim() || undefined,
        onboardingStatus: values.onboardingStatus,
        service: {
          cityIds: values.service.cityIds,
          zoneIds: values.service.zoneIds ?? [],
          radiusKm: values.service.radiusKm
        }
      };

      await save.mutateAsync(payload);
      toast("Profile saved");
      nav("/provider/inventory");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Failed to save profile", "error");
    }
  }

  if (profile.isLoading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Provider setup</div>
        <div className="mt-1 text-sm text-slate-600">
          Complete your profile to list items and manage availability.
        </div>
      </Card>

      <Card className="p-4">
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">Provider type</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("providerType", "INDIVIDUAL")}
                className={`h-11 rounded-xl border text-sm font-medium ${
                  providerType === "INDIVIDUAL"
                    ? "border-teal-300 bg-teal-50 text-teal-800"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setValue("providerType", "BUSINESS")}
                className={`h-11 rounded-xl border text-sm font-medium ${
                  providerType === "BUSINESS"
                    ? "border-teal-300 bg-teal-50 text-teal-800"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                Business
              </button>
            </div>
            {errors.providerType?.message && <div className="text-xs text-red-600">{errors.providerType.message}</div>}
          </div>

          {providerType === "BUSINESS" && (
            <Input label="Business name" error={errors.businessName?.message} {...register("businessName")} />
          )}

          <Input label="Display name" error={errors.displayName?.message} {...register("displayName")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone (optional)" error={errors.phone?.message} {...register("phone")} />
            <Input label="Email" error={errors.email?.message} {...register("email")} />
          </div>

          {/* Simple cityIds input for MVP; later replace with multi-select from /public/cities */}
          <Input
            label="Service City IDs (comma-separated)"
            error={errors.service?.cityIds?.message as any}
            placeholder="e.g. 65ab..., 65ac..."
            onChange={(e) =>
              setValue(
                "service.cityIds",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
          />

          <Input label="Radius (km)" type="number" error={errors.service?.radiusKm?.message as any} {...register("service.radiusKm")} />

          <div className="flex gap-2">
            <Button className="flex-1" type="submit" disabled={isSubmitting || save.isPending}>
              {save.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              type="button"
              onClick={() => nav("/provider/inventory")}
            >
              Skip
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
