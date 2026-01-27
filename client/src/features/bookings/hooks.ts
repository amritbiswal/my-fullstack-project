import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, createBooking, fetchBooking, fetchMyBookings } from "./bookingApi";

export function useMyBookings() {
  return useQuery({ queryKey: ["bookings", "my"], queryFn: fetchMyBookings });
}

export function useBooking(bookingId?: string) {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBooking(bookingId!),
    enabled: Boolean(bookingId)
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings", "my"] });
      qc.invalidateQueries({ queryKey: ["skus"] });
      qc.invalidateQueries({ queryKey: ["sku"] });
    }
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings", "my"] });
      qc.invalidateQueries({ queryKey: ["skus"] });
      qc.invalidateQueries({ queryKey: ["sku"] });
    }
  });
}
