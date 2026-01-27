import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/app/AppShell";
import { useTrip } from "../features/trip/TripContext";

export function TouristLayout() {
  const { cityId, startDate, endDate } = useTrip();
  const nav = useNavigate();
  const loc = useLocation();

  // Force trip setup before browsing/booking
  const needsTrip =
    loc.pathname.startsWith("/app/") &&
    !loc.pathname.startsWith("/app/trip") &&
    (!cityId || !startDate || !endDate);

  if (needsTrip) {
    nav("/app/trip", { replace: true });
  }

  return (
    <AppShell title="Packless">
      <Outlet />
    </AppShell>
  );
}
