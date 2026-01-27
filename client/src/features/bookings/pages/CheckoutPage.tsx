import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrip } from "../../trip/TripContext";
import { useSkuDetail } from "../../catalog/hooks";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useCreateBooking } from "../hooks";
import { useToast } from "../../../components/ui/Toast";
import { daysBetweenExclusiveEnd, formatCurrency } from "../../../utils/format";

export function CheckoutPage() {
  const { skuId } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const { cityId, startDate, endDate } = useTrip();

  const params = useMemo(() => ({ cityId, startDate, endDate }), [cityId, startDate, endDate]);
  const sku = useSkuDetail(skuId, params);

  const [deliveryOption, setDeliveryOption] = useState<"PICKUP" | "PROVIDER_DELIVERY">("PICKUP");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const create = useCreateBooking();

  if (sku.isLoading) return <Skeleton className="h-64" />;
  if (!sku.data) return <Card className="p-4">Item not found.</Card>;

  const s = sku.data;
  const days = daysBetweenExclusiveEnd(startDate!, endDate!);
  const subtotal = s.pricePerDay * days;
  const deposit = s.transactionMode === "MANAGED_RENTAL" ? (s.depositAmount ?? 0) : 0;

  async function onConfirm() {
    try {
      const booking = await create.mutateAsync({
        skuId: s._id,
        cityId: cityId!,
        startDate: startDate!,
        endDate: endDate!,
        deliveryOption,
        deliveryAddress:
          deliveryOption === "PROVIDER_DELIVERY"
            ? { line1: address1, line2: address2 }
            : undefined
      });
      toast("Booking confirmed");
      nav(`/app/bookings/${booking._id}`);
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Booking failed", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-base font-semibold">{s.name}</div>
        <div className="mt-2 flex gap-2 flex-wrap">
          <Badge tone="slate">{formatCurrency(s.pricePerDay)}/day</Badge>
          <Badge tone="teal">{days} days</Badge>
          {deposit ? <Badge tone="orange">{formatCurrency(deposit)} deposit</Badge> : null}
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-sm font-semibold">Delivery</div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant={deliveryOption === "PICKUP" ? "primary" : "secondary"}
              onClick={() => setDeliveryOption("PICKUP")}
            >
              Pickup
            </Button>
            <Button
              className="flex-1"
              variant={deliveryOption === "PROVIDER_DELIVERY" ? "primary" : "secondary"}
              onClick={() => setDeliveryOption("PROVIDER_DELIVERY")}
              disabled={!s.deliveryAllowed}
            >
              Delivery
            </Button>
          </div>

          {deliveryOption === "PROVIDER_DELIVERY" && (
            <div className="mt-3 space-y-2">
              <Input label="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <Input label="Address line 2 (optional)" value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        {deposit ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Deposit (held)</span>
            <span className="font-semibold">{formatCurrency(deposit)}</span>
          </div>
        ) : null}
      </Card>

      <Button
        className="w-full"
        onClick={onConfirm}
        disabled={create.isPending || (deliveryOption === "PROVIDER_DELIVERY" && !address1.trim())}
      >
        {create.isPending ? "Confirming..." : "Confirm booking"}
      </Button>

      {s.transactionMode === "VERIFIED_ONLY" && (
        <Card className="p-4 text-sm text-slate-700">
          Verified-only: Packless verifies the provider/item. Payment/deposit may be handled by the provider.
        </Card>
      )}
    </div>
  );
}
