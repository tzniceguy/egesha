import { create } from "zustand";
import { getAvailableSpots, getNearbyParkingLots } from "@/services/parking";
import { ParkingLots, ParkingSpot } from "@/lib/types";

interface ParkingState {
  nearbyLots: ParkingLots[];
  selectedLot: ParkingLots | null;
  availableSpots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  isLoading: boolean;
  fetchNearbyLots: (lat: number, lon: number, radius?: number) => Promise<void>;
  selectLot: (lot: ParkingLots | null) => void;
  selectSpot: (spot: ParkingSpot | null) => void;
  fetchAvailableSpots: (lotId: number) => Promise<void>;
  setSearchResults: (results: ParkingLots[]) => void;
  clearSelection: () => void;
}

export const useParkingStore = create<ParkingState>((set) => ({
  nearbyLots: [],
  selectedLot: null,
  availableSpots: [],
  selectedSpot: null,
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
    set({ selectedLot: lot, selectedSpot: null }); // Reset selected spot when lot changes
    if (lot) {
      useParkingStore.getState().fetchAvailableSpots(lot.id);
    } else {
      set({ availableSpots: [] });
    }
  },
  selectSpot: (spot) => {
    set({ selectedSpot: spot });
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
  setSearchResults: (results) => {
    set({ nearbyLots: results });
  },
  clearSelection: () => {
    set({ selectedLot: null, selectedSpot: null, availableSpots: [] });
  },
}));
