import apiClient from "@/lib/api";
import { Booking, BookingData } from "@/lib/types";

export const createBooking = async (data: BookingData) => {
  const response = await apiClient.post("/api/parking/bookings/", data);
  return response.data;
};

export const getBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get("/api/parking/bookings/");
  return response.data;
};
