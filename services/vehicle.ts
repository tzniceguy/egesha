import apiClient from "@/lib/api";
import { VehicleData } from "@/lib/types";

export const getVehicles = async () => {
  const response = await apiClient.get("/api/parking/vehicles/");
  return response.data;
};

export const addVehicle = async (data: VehicleData) => {
  const response = await apiClient.post("/api/parking/vehicles/", data);
  return response.data;
};
