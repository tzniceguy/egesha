import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";

const API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

export const getRoute = async (origin: any, destination: any) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        origin: { location: { latLng: origin } },
        destination: { location: { latLng: destination } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        polylineEncoding: "ENCODED_POLYLINE",
        computeAlternativeRoutes: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
        },
      },
    );

    if (response.data.routes && response.data.routes.length > 0) {
      return response.data.routes[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
};
