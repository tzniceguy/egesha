import apiClient from "@/lib/api";

interface NearbyLotsParams {
  lat: number;
  lon: number;
  radius?: number;
}

export const getNearbyParkingLots = async (params: NearbyLotsParams) => {
  const response = await apiClient.get("parking/lots/nearby/", {
    params,
  });
  return response.data;
};

export const getAvailableSpots = async (lotId: number) => {
  const response = await apiClient.get(
    `/parking/lots/${lotId}/available-spots/`,
  );
  return response.data;
};
