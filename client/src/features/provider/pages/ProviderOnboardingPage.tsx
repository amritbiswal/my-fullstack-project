import { useEffect, useState } from "react";
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
import { Dialog } from "@headlessui/react";
import { Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/client";

export function ProviderOnboardingPage() {
  const { toast } = useToast();
  const nav = useNavigate();
  const profile = useProviderProfile();
  const save = useUpsertProviderProfile();
  const { cityId } = useTrip();

  // Fetch cities and zones
  const cities = useQuery({
    queryKey: ["public-cities"],
    queryFn: async () => (await api.get("/api/public/cities")).data.data,
  });
  const zones = useQuery({
    queryKey: ["public-zones"],
    queryFn: async () => (await api.get("/api/public/zones")).data.data,
  });

  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);

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
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        postalCode: ""
      },
      service: { cityIds: cityId ? [cityId] : [], zoneIds: [], radiusKm: 10 }
    }
  });

  const providerType = watch("providerType");
  const selectedCityIds = watch("service.cityIds");
  const selectedZoneIds = watch("service.zoneIds");

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
    setValue("address.line1", p.address?.line1 ?? "");
    setValue("address.line2", p.address?.line2 ?? "");
    setValue("address.city", p.address?.city ?? "");
    setValue("address.state", p.address?.state ?? "");
    setValue("address.country", p.address?.country ?? "");
    setValue("address.postalCode", p.address?.postalCode ?? "");
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
        address: {
          line1: values.address?.line1 || "",
          line2: values.address?.line2 || "",
          city: values.address?.city || "",
          state: values.address?.state || "",
          country: values.address?.country || "",
          postalCode: values.address?.postalCode || ""
        },
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
            <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
            <Input label="Email" error={errors.email?.message} {...register("email")} />
          </div>

          {/* Address fields */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">Address</div>
            <Input label="Address Line 1" {...register("address.line1")} />
            <Input label="Address Line 2" {...register("address.line2")} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" {...register("address.city")} />
              <Input label="State" {...register("address.state")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Country" {...register("address.country")} />
              <Input label="Postal Code" {...register("address.postalCode")} />
            </div>
          </div>

          {/* Multi-select for cities */}
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">Service Cities</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {(cities.data ?? [])
                .filter((city: any) => selectedCityIds.includes(city._id))
                .map((city: any) => (
                  <span
                    key={city._id}
                    className="flex items-center gap-1 rounded bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800 border border-teal-200"
                  >
                    {city.name}
                    <button
                      type="button"
                      className="ml-1 text-teal-600 hover:text-red-600"
                      onClick={() =>
                        setValue(
                          "service.cityIds",
                          selectedCityIds.filter((id: string) => id !== city._id),
                          { shouldValidate: true }
                        )
                      }
                      aria-label={`Remove ${city.name}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              <button
                type="button"
                className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-50"
                onClick={() => setCityDialogOpen(true)}
              >
                + Add City
              </button>
            </div>
            {errors.service?.cityIds?.message && (
              <div className="mt-1 text-xs text-red-600">
                {errors.service.cityIds.message as any}
              </div>
            )}

            {/* Modal for city selection */}
            <Dialog
              open={cityDialogOpen}
              onClose={() => setCityDialogOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-4">
                  <Dialog.Title className="text-lg font-semibold mb-2">
                    Select Cities
                  </Dialog.Title>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {(cities.data ?? []).map((city: any) => {
                      const checked = selectedCityIds.includes(city._id);
                      return (
                        <label
                          key={city._id}
                          className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer ${
                            checked ? "bg-teal-50" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked
                                ? selectedCityIds.filter((id: string) => id !== city._id)
                                : [...selectedCityIds, city._id];
                              setValue("service.cityIds", next, { shouldValidate: true });
                            }}
                            className="accent-teal-600"
                          />
                          <span className="flex-1 truncate">{city.name}</span>
                          {checked && <Check size={16} className="text-teal-600" />}
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded px-4 py-2 text-sm font-medium bg-slate-100"
                      onClick={() => setCityDialogOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </label>

          {/* Multi-select for zones */}
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">Service Zones</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {(zones.data ?? [])
                .filter((zone: any) => selectedZoneIds.includes(zone._id))
                .map((zone: any) => (
                  <span
                    key={zone._id}
                    className="flex items-center gap-1 rounded bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800 border border-teal-200"
                  >
                    {zone.name}
                    <button
                      type="button"
                      className="ml-1 text-teal-600 hover:text-red-600"
                      onClick={() =>
                        setValue(
                          "service.zoneIds",
                          selectedZoneIds.filter((id: string) => id !== zone._id),
                          { shouldValidate: true }
                        )
                      }
                      aria-label={`Remove ${zone.name}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              <button
                type="button"
                className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-50"
                onClick={() => setZoneDialogOpen(true)}
              >
                + Add Zone
              </button>
            </div>
            {errors.service?.zoneIds?.message && (
              <div className="mt-1 text-xs text-red-600">
                {errors.service.zoneIds.message as any}
              </div>
            )}

            {/* Modal for zone selection */}
            <Dialog
              open={zoneDialogOpen}
              onClose={() => setZoneDialogOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-4">
                  <Dialog.Title className="text-lg font-semibold mb-2">
                    Select Zones
                  </Dialog.Title>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {(zones.data ?? []).map((zone: any) => {
                      const checked = selectedZoneIds.includes(zone._id);
                      return (
                        <label
                          key={zone._id}
                          className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer ${
                            checked ? "bg-teal-50" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked
                                ? selectedZoneIds.filter((id: string) => id !== zone._id)
                                : [...selectedZoneIds, zone._id];
                              setValue("service.zoneIds", next, { shouldValidate: true });
                            }}
                            className="accent-teal-600"
                          />
                          <span className="flex-1 truncate">{zone.name}</span>
                          {checked && <Check size={16} className="text-teal-600" />}
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded px-4 py-2 text-sm font-medium bg-slate-100"
                      onClick={() => setZoneDialogOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </label>

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
