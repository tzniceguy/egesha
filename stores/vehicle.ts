import { create } from "zustand";
import { getVehicles, addVehicle, deleteVehicle } from "@/services/vehicle";
import { Vehicle, VehicleData } from "@/lib/types";

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  fetchVehicles: () => Promise<void>;
  addVehicle: (data: VehicleData) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
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
  addVehicle: async (data: VehicleData) => {
    try {
      const newVehicle = await addVehicle(data);
      set((state) => ({
        vehicles: [...state.vehicles, newVehicle],
      }));
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      throw error;
    }
  },
  deleteVehicle: async (id: number) => {
    try {
      await deleteVehicle(id);
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      throw error;
    }
  },
}));