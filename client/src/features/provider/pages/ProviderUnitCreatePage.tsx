import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitSchema, type UnitForm } from "../schemas";
import { useCreateUnit } from "../hooks";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/client";

export function ProviderUnitCreatePage() {
  const nav = useNavigate();
  const { toast } = useToast();
  const create = useCreateUnit();

  // Fetch cities and SKUs
  const cities = useQuery({
    queryKey: ["cities"],
    queryFn: async () => (await api.get("/api/public/cities")).data.data,
  });
  const skus = useQuery({
    queryKey: ["skus"],
    queryFn: async () => (await api.get("/api/provider/skus")).data.data,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UnitForm>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      skuId: "",
      cityId: "",
      title: "",
      condition: "GOOD",
      photos: [],
      deliveryOptions: { pickup: true, providerDelivery: false }
    }
  });

  const pickup = watch("deliveryOptions.pickup");
  const delivery = watch("deliveryOptions.providerDelivery");

  async function onSubmit(values: UnitForm) {
    try {
      const unit = await create.mutateAsync({
        skuId: values.skuId,
        cityId: values.cityId,
        title: values.title?.trim() || undefined,
        condition: values.condition,
        photos: values.photos,
        deliveryOptions: values.deliveryOptions
      });
      toast("Unit created");
      nav(`/provider/inventory/${unit._id}`);
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Create failed", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Add unit</div>
        <div className="mt-1 text-sm text-slate-600">Units are real items mapped to a Platform SKU.</div>
      </Card>

      <Card className="p-4">
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* SKU Dropdown */}
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">SKU</div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              {...register("skuId")}
              disabled={skus.isLoading}
              defaultValue=""
            >
              <option value="" disabled>
                {skus.isLoading ? "Loading SKUs..." : "Select SKU"}
              </option>
              {skus.data?.map((sku: any) => (
                <option key={sku._id} value={sku._id}>
                  {sku.name}
                </option>
              ))}
            </select>
            {errors.skuId?.message && (
              <div className="text-xs text-red-600">{errors.skuId.message}</div>
            )}
          </label>

          {/* City Dropdown */}
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">City</div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              {...register("cityId")}
              disabled={cities.isLoading}
              defaultValue=""
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
            {errors.cityId?.message && (
              <div className="text-xs text-red-600">{errors.cityId.message}</div>
            )}
          </label>

          <Input label="Title (optional)" placeholder="Internal label e.g. Speaker #1" error={errors.title?.message} {...register("title")} />

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">Condition</div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              {...register("condition")}
            >
              <option value="NEW">NEW</option>
              <option value="EXCELLENT">EXCELLENT</option>
              <option value="GOOD">GOOD</option>
              <option value="FAIR">FAIR</option>
            </select>
            {errors.condition?.message && <div className="text-xs text-red-600">{errors.condition.message}</div>}
          </div>

          <Input
            label="Photo URLs (comma-separated)"
            placeholder="https://... , https://..."
            onChange={(e) =>
              setValue(
                "photos",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
          />

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">Delivery options</div>
            <div className="flex gap-2">
              <Button
                type="button"
                className="flex-1"
                variant={pickup ? "primary" : "secondary"}
                onClick={() => setValue("deliveryOptions.pickup", !pickup)}
              >
                Pickup
              </Button>
              <Button
                type="button"
                className="flex-1"
                variant={delivery ? "primary" : "secondary"}
                onClick={() => setValue("deliveryOptions.providerDelivery", !delivery)}
              >
                Provider delivery
              </Button>
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting || create.isPending}>
            {create.isPending ? "Creating..." : "Create unit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}