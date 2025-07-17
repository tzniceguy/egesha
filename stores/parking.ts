import { create } from "zustand";
import { getAvailableSpots, getNearbyParkingLots } from "@/services/parking";
import { ParkingLots, ParkingSpot } from "@/lib/types";

interface ParkingState {
  nearbyLots: ParkingLots[];
  selectedLot: ParkingLots | null;
  availableSpots: ParkingSpot[];
  isLoading: boolean;
  fetchNearbyLots: (lat: number, lon: number, radius?: number) => Promise<void>;
  selectLot: (lot: ParkingLots | null) => void;
  fetchAvailableSpots: (lotId: number) => Promise<void>;
}

export const useParkingStore = create<ParkingState>((set) => ({
  nearbyLots: [],
  selectedLot: null,
  availableSpots: [],
  isLoading: false,
  fetchNearbyLots: async (lat, lon, radius) => {
    set({ isLoading: true });
    try {
      const lots = await getNearbyParkingLots({ lat, lon, radius });
      set({ nearbyLots: lots, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch nearby lots:", error);
      set({ isLoading: false });
    }
  },
  selectLot: (lot) => {
    set({ selectedLot: lot });
    if (lot) {
      useParkingStore.getState().fetchAvailableSpots(lot.id);
    } else {
      set({ availableSpots: [] });
    }
  },
  fetchAvailableSpots: async (lotId) => {
    set({ isLoading: true });
    try {
      const spots = await getAvailableSpots(lotId);
      set({ availableSpots: spots, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch available spots:", error);
      set({ isLoading: false });
    }
  },
}));
