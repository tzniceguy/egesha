import { create } from "zustand";
import { getVehicles, addVehicle } from "@/services/vehicle";
import { Vehicle, VehicleData } from "@/lib/types";

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  fetchVehicles: () => Promise<void>;
  addVehicle: (data: VehicleData) => Promise<void>;
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
  addVehicle: async (data) => {
    set({ isLoading: true });
    try {
      await addVehicle(data);
      set({ isLoading: false });
      // Refetch vehicles after adding a new one
      useVehicleStore.getState().fetchVehicles();
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
