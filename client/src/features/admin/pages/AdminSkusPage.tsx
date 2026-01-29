import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { useToast } from "../../../components/ui/Toast";
import { Dialog } from "@headlessui/react";
import { Check, X } from "lucide-react";

import { useAdminCategories, useAdminSkus, useCreateAdminSku } from "../hooks";
import { AdminListCard } from "../components/AdminListCard";
import { createSkuSchema, type CreateSkuForm } from "../schemas";
import { toSlug } from "../../../utils/slug";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/client";

export function AdminSkusPage() {
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const { toast } = useToast();
  const categories = useAdminCategories();
  const skus = useAdminSkus();
  const create = useCreateAdminSku();
  

  // Fetch cities for multi-select
  const cities = useQuery({
    queryKey: ["public-cities"],
    queryFn: async () => (await api.get("/api/public/cities")).data.data,
  });

  function getCategoryName(category: { name?: string } | string) {
    if (typeof category === "string") return category;
    return category?.name ?? "";
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSkuForm>({
    resolver: zodResolver(createSkuSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      categoryId: "",
      images: [],
      pricePerDay: 10,
      depositAmount: 0,
      transactionMode: "MANAGED_RENTAL",
      deliveryAllowed: true,
      verificationRequired: true,
      allowedCityIds: [],
    },
  });

  const slug = watch("slug");
  const transactionMode = watch("transactionMode");
  const deliveryAllowed = watch("deliveryAllowed");
  const verificationRequired = watch("verificationRequired");
  const allowedCityIds = watch("allowedCityIds");

  async function onSubmit(values: CreateSkuForm) {
    try {
      await create.mutateAsync({
        name: values.name.trim(),
        slug: values.slug.trim(),
        description: values.description?.trim() || undefined,
        categoryId: values.categoryId,
        images: values.images,
        pricePerDay: values.pricePerDay,
        depositAmount:
          values.transactionMode === "MANAGED_RENTAL"
            ? (values.depositAmount ?? 0)
            : undefined,
        transactionMode: values.transactionMode,
        deliveryAllowed: values.deliveryAllowed,
        verificationRequired: values.verificationRequired,
        allowedCityIds: values.allowedCityIds,
      });

      toast("SKU created");
      reset();
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Create failed", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Admin • SKUs</div>
        <div className="mt-1 text-sm text-slate-600">
          Create platform SKUs. Providers list units against these SKUs.
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-semibold">Create SKU</div>

        <form className="mt-3 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            placeholder="Free-size rain jacket"
            error={errors.name?.message}
            {...register("name", {
              onChange: (e) => {
                const v = (e.target as HTMLInputElement).value;
                if (!slug)
                  setValue("slug", toSlug(v), { shouldValidate: true });
              },
            })}
          />

          <Input
            label="Slug"
            placeholder="free-size-rain-jacket"
            error={errors.slug?.message}
            {...register("slug")}
          />

          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">
              Category
            </div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              value={watch("categoryId")}
              onChange={(e) =>
                setValue("categoryId", e.target.value, { shouldValidate: true })
              }
            >
              <option value="">Select category</option>
              {(categories.data ?? []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId?.message && (
              <div className="mt-1 text-xs text-red-600">
                {errors.categoryId.message}
              </div>
            )}
          </label>

          {/* Multi-select for cities */}
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">
              Cities
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {(cities.data ?? [])
                .filter((city: any) => allowedCityIds.includes(city._id))
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
                          "allowedCityIds",
                          allowedCityIds.filter(
                            (id: string) => id !== city._id,
                          ),
                          { shouldValidate: true },
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
            {errors.allowedCityIds?.message && (
              <div className="mt-1 text-xs text-red-600">
                {errors.allowedCityIds.message}
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
                      const checked = allowedCityIds.includes(city._id);
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
                                ? allowedCityIds.filter(
                                    (id: string) => id !== city._id,
                                  )
                                : [...allowedCityIds, city._id];
                              setValue("allowedCityIds", next, {
                                shouldValidate: true,
                              });
                            }}
                            className="accent-teal-600"
                          />
                          <span className="flex-1 truncate">{city.name}</span>
                          {checked && (
                            <Check size={16} className="text-teal-600" />
                          )}
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

          <Input
            label="Description (optional)"
            error={errors.description?.message}
            {...register("description")}
            placeholder="Lightweight, waterproof, unisex"
          />

          <Input
            label="Image URLs (comma-separated)"
            placeholder="https://... , https://..."
            onChange={(e) => {
              const urls = e.target.value
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean);
              setValue("images", urls, { shouldValidate: true });
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price per day"
              type="number"
              error={errors.pricePerDay?.message}
              {...register("pricePerDay")}
            />
            <Input
              label="Deposit (managed only)"
              type="number"
              error={errors.depositAmount?.message}
              {...register("depositAmount")}
              disabled={transactionMode !== "MANAGED_RENTAL"}
            />
          </div>

          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">
              Transaction mode
            </div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              value={transactionMode}
              onChange={(e) =>
                setValue("transactionMode", e.target.value as any, {
                  shouldValidate: true,
                })
              }
            >
              <option value="MANAGED_RENTAL">
                MANAGED_RENTAL (Packless holds deposit)
              </option>
              <option value="VERIFIED_ONLY">VERIFIED_ONLY (verify only)</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setValue("deliveryAllowed", !deliveryAllowed)}
              className={`h-11 rounded-xl border px-4 text-sm font-medium ${
                deliveryAllowed
                  ? "border-teal-300 bg-teal-50 text-teal-800"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              Delivery allowed: {deliveryAllowed ? "Yes" : "No"}
            </button>

            <button
              type="button"
              onClick={() =>
                setValue("verificationRequired", !verificationRequired)
              }
              className={`h-11 rounded-xl border px-4 text-sm font-medium ${
                verificationRequired
                  ? "border-teal-300 bg-teal-50 text-teal-800"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              Verification required: {verificationRequired ? "Yes" : "No"}
            </button>
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={isSubmitting || create.isPending || categories.isLoading}
          >
            {create.isPending ? "Creating..." : "Create SKU"}
          </Button>

          {categories.isLoading && (
            <div className="text-xs text-slate-500">Loading categories…</div>
          )}
          {(categories.data?.length ?? 0) === 0 && !categories.isLoading && (
            <div className="text-xs text-orange-700">
              Create categories first before creating SKUs.
            </div>
          )}
        </form>
      </Card>

      <div className="px-1 text-sm font-semibold text-slate-800">All SKUs</div>

      {skus.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (skus.data?.length ?? 0) === 0 ? (
        <Card className="p-4 text-sm text-slate-600">No SKUs yet.</Card>
      ) : (
        <div className="space-y-2">
          {skus.data!.map((s) => (
            <AdminListCard
              key={s._id}
              title={s.name}
              subtitle={`Slug: ${s.slug}`}
              rightBadge={{
                text:
                  s.transactionMode === "MANAGED_RENTAL"
                    ? "Managed"
                    : "Verified",
                tone: s.transactionMode === "MANAGED_RENTAL" ? "teal" : "slate",
              }}
              metaLines={[
                `Category: ${getCategoryName(s.categoryId)}`,
                `Price/day: ${s.pricePerDay}`,
                s.depositAmount != null
                  ? `Deposit: ${s.depositAmount}`
                  : "Deposit: —",
                `Delivery: ${s.deliveryAllowed ? "Yes" : "No"}`,
                `Verification: ${s.verificationRequired ? "Yes" : "No"}`,
                `ID: ${s._id}`,
              ]}
            />
          ))}
        </div>
      )}

      <Card className="p-4">
        <div className="text-sm font-semibold">Notes</div>
        <div className="mt-1 text-sm text-slate-600">
          Providers create <span className="font-semibold">Units</span> mapped
          to these SKUs. Only units approved by staff become{" "}
          <span className="font-semibold">ACTIVE</span> and appear in tourist
          search.
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="teal">MANAGED_RENTAL</Badge>
          <Badge tone="slate">VERIFIED_ONLY</Badge>
        </div>
      </Card>
    </div>
  );
}
