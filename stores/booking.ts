import { create } from "zustand";
import { createBooking } from "@/services/booking";
import { BookingData } from "@/lib/types";

interface BookingState {
  isLoading: boolean;
  createBooking: (data: BookingData) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
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
}));
