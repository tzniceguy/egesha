import { useState, useRef, useCallback } from "react";
import { MapComponentRef } from "@/components/map-component";
import { LocationType } from "@/lib/types";

export const useMapLogic = () => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const mapRef = useRef<MapComponentRef>(null);

  const handleLocationUpdate = useCallback((location: LocationType | null) => {
    setUserLocation(location);
  }, []);

  return {
    mapRef,
    userLocation,
    handleLocationUpdate,
  };
};
