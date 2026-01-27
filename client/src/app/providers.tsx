import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AuthProvider } from "../auth/AuthContext";
import { TripProvider } from "../features/trip/TripContext";
import { ToastProvider } from "../components/ui/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false }
  }
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <TripProvider>{children}</TripProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}