import apiClient from "@/lib/api";
import { Booking, BookingData } from "@/lib/types";

export const createBooking = async (data: BookingData): Promise<Booking> => {
  const response = await apiClient.post("parking/bookings/quick-book/", data);
  return response.data;
};

export const getBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get("parking/bookings/");
  return response.data;
};
