import apiClient from "@/lib/api";
import { VehicleData } from "@/lib/types";

export const getVehicles = async () => {
  const response = await apiClient.get("parking/vehicles/");
  return response.data;
};

export const addVehicle = async (data: VehicleData) => {
  const response = await apiClient.post("parking/vehicles/", data);
  return response.data;
};

export const getVehicle = async (vehicleId: number) => {
  const response = await apiClient.get(`parking/vehicles/${vehicleId}/`);
  return response.data;
};

export const deleteVehicle = async (vehicleId: number) => {
  const response = await apiClient.delete(`parking/vehicles/${vehicleId}/`);
  return response.data;
};
