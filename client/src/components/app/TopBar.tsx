import { useLocation, useNavigate } from "react-router-dom";
import { useTrip } from "../../features/trip/TripContext";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function TopBar({ title }: { title: string }) {
  const nav = useNavigate();
  const loc = useLocation();
  const { cityName, startDate, endDate } = useTrip();

  const showBack = loc.pathname.startsWith("/app/sku") || loc.pathname.startsWith("/app/checkout") || loc.pathname.startsWith("/app/bookings/");
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={() => nav(-1)}>
              Back
            </Button>
          )}
          <div className="text-base font-semibold text-slate-900">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          {cityName && <Badge tone="teal">{cityName}</Badge>}
          {startDate && endDate && <Badge tone="slate">{startDate} → {endDate}</Badge>}
        </div>
      </div>
    </header>
  );
}
