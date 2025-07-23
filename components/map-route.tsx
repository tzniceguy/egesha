import { MapViewRoute } from "react-native-maps-routes";
import { LocationType } from "@/lib/types";

interface MapRouteProps {
  origin: LocationType;
  destination: LocationType;
}

export const MapRouteComponent = ({ origin, destination }: MapRouteProps) => (
  <MapViewRoute
    origin={origin}
    destination={destination}
    apiKey={process.env.GOOGLE_MAPS_API_KEY}
    strokeWidth={3}
    strokeColor="#3b82f6"
  />
);
