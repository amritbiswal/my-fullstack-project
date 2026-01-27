import React, { createContext, useContext, useMemo, useState } from "react";

type Trip = {
  cityId: string | null;
  cityName: string | null;
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null;   // YYYY-MM-DD
  setTrip: (t: Partial<Trip>) => void;
  clear: () => void;
};

const LS_KEY = "packless_trip";

const TripCtx = createContext<Trip | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const initial = (() => {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Partial<Trip>) : {};
  })();

  const [cityId, setCityId] = useState<string | null>(initial.cityId ?? null);
  const [cityName, setCityName] = useState<string | null>(initial.cityName ?? null);
  const [startDate, setStartDate] = useState<string | null>(initial.startDate ?? null);
  const [endDate, setEndDate] = useState<string | null>(initial.endDate ?? null);

  function persist(next: Partial<Trip>) {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        cityId: next.cityId ?? cityId,
        cityName: next.cityName ?? cityName,
        startDate: next.startDate ?? startDate,
        endDate: next.endDate ?? endDate
      })
    );
  }

  function setTrip(next: Partial<Trip>) {
    if (next.cityId !== undefined) setCityId(next.cityId);
    if (next.cityName !== undefined) setCityName(next.cityName);
    if (next.startDate !== undefined) setStartDate(next.startDate);
    if (next.endDate !== undefined) setEndDate(next.endDate);
    persist(next);
  }

  function clear() {
    setCityId(null);
    setCityName(null);
    setStartDate(null);
    setEndDate(null);
    localStorage.removeItem(LS_KEY);
  }

  const value = useMemo(
    () => ({ cityId, cityName, startDate, endDate, setTrip, clear }),
    [cityId, cityName, startDate, endDate]
  );

  return <TripCtx.Provider value={value}>{children}</TripCtx.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripCtx);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
