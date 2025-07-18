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

// Define types for search parameters
export interface SearchParkingParams {
  query: string;
  latitude?: number; // Optional: for location-based search
  longitude?: number; // Optional: for location-based search
  radius?: number; // Optional: search radius in meters
  available_at?: string; // Optional: time in HH:MM format
}

// Define the response type
export interface ParkingSearchResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  available_spots_count?: number;
  price_per_hour?: number;
  distance?: number; // in meters, if location-based
}

// Search parking locations function
export const searchParkingLocations = async (
  params: SearchParkingParams,
): Promise<ParkingSearchResult[]> => {
  try {
    const response = await apiClient.get("parking/lots/search/", {
      params: {
        q: params.query,
        lat: params.latitude,
        lon: params.longitude,
        radius: params.radius,
        available_at: params.available_at,
      },
    });

    return response.data.map((lot: any) => ({
      id: lot.id,
      name: lot.name,
      address: lot.address,
      latitude: parseFloat(lot.latitude),
      longitude: parseFloat(lot.longitude),
      available_spots_count: lot.available_spots_count,
      price_per_hour: lot.price_per_hour,
      distance: lot.distance,
    }));
  } catch (error) {
    console.error("Error searching parking locations:", error);
    throw error;
  }
};
