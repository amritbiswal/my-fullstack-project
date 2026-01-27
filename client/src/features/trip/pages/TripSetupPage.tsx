import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCities } from "../../catalog/hooks";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useTrip } from "../TripContext";

export function TripSetupPage() {
  const nav = useNavigate();
  const { setTrip, cityId, startDate, endDate } = useTrip();
  const { data, isLoading } = useCities();
  const [q, setQ] = useState("");
  const [localStart, setLocalStart] = useState(startDate ?? "");
  const [localEnd, setLocalEnd] = useState(endDate ?? "");

  const cities = useMemo(() => {
    const list = data ?? [];
    if (!q.trim()) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  }, [data, q]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-lg font-semibold">Plan your trip</div>
        <div className="mt-3 space-y-3">
          <Input label="Search city" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Paris, Barcelona..." />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="date" value={localStart} onChange={(e) => setLocalStart(e.target.value)} />
            <Input label="End date" type="date" value={localEnd} onChange={(e) => setLocalEnd(e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="text-sm font-medium text-slate-700 px-1">Choose a destination</div>
      <div className="space-y-2">
        {isLoading && <Card className="p-4">Loading cities…</Card>}
        {cities.map((c) => (
          <button
            key={c._id}
            className={`w-full text-left rounded-2xl border p-4 bg-white shadow-sm ${
              c._id === cityId ? "border-teal-300" : "border-slate-100"
            }`}
            onClick={() => setTrip({ cityId: c._id, cityName: c.name })}
          >
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-slate-500">{c.countryCode ?? "—"}</div>
          </button>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={() => {
          setTrip({ startDate: localStart, endDate: localEnd });
          nav("/app/home");
        }}
        disabled={!cityId || !localStart || !localEnd}
      >
        Continue
      </Button>
    </div>
  );
}
