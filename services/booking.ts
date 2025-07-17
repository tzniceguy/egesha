import apiClient from "@/lib/api";
import { BookingData } from "@/lib/types";

export const createBooking = async (data: BookingData) => {
  const response = await apiClient.post("/api/parking/bookings/", data);
  return response.data;
};
