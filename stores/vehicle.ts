import { create } from "zustand";
import { getVehicles } from "@/services/vehicle";
import { Vehicle } from "@/lib/types";

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  fetchVehicles: () => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  isLoading: false,
  fetchVehicles: async () => {
    set({ isLoading: true });
    try {
      const vehicles = await getVehicles();
      set({ vehicles, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      set({ isLoading: false });
    }
  },
}));