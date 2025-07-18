import { create } from "zustand";
import { createBooking, getBookings } from "@/services/booking";
import { Booking, BookingData } from "@/lib/types";

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  createBooking: (data: BookingData) => Promise<void>;
  fetchBookings: () => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  isLoading: false,
  createBooking: async (data) => {
    set({ isLoading: true });
    try {
      await createBooking(data);
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to create booking:", error);
      set({ isLoading: false });
      throw error;
    }
  },
  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const bookings = await getBookings();
      set({ bookings, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      set({ isLoading: false });
    }
  },
}));
