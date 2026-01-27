import { api } from "../../api/client";
import type { ApiSuccess } from "../../api/types";
import type { Booking, CreateBookingInput } from "./bookingTypes";

export async function createBooking(payload: CreateBookingInput): Promise<Booking> {
  const res = await api.post<ApiSuccess<Booking>>("/api/bookings", payload);
  return res.data.data;
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const res = await api.get<ApiSuccess<Booking[]>>("/api/booking/my");
  return res.data.data;
}

export async function fetchBooking(bookingId: string): Promise<Booking> {
  const res = await api.get<ApiSuccess<Booking>>(`/api/booking/${bookingId}`);
  return res.data.data;
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const res = await api.post<ApiSuccess<Booking>>(`/api/booking/${bookingId}/cancel`);
  return res.data.data;
}
