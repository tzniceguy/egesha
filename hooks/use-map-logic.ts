import { useState, useRef, useCallback } from "react";
import { Region } from "react-native-maps";
import { MapComponentRef } from "@/components/map-component";
import { LocationType } from "@/lib/types";
import {
  ZOOMED_IN_DELTA,
  ZOOMED_OUT_DELTA,
  INITIAL_MAP_REGION,
} from "@/lib/constants";

export const useMapLogic = () => {
  const [isModalExpanded, setIsModalExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const mapRef = useRef<MapComponentRef>(null);

  const handleLocationUpdate = useCallback(
    (location: LocationType | null) => {
      setUserLocation(location);
      if (location && !isModalExpanded) {
        mapRef.current?.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          ...ZOOMED_OUT_DELTA,
        });
      } else if (!location) {
        mapRef.current?.animateToRegion(INITIAL_MAP_REGION);
      }
    },
    [isModalExpanded],
  );

  const handleModalStateChange = useCallback(
    (expanded: boolean) => {
      setIsModalExpanded(expanded);

      if (userLocation && mapRef.current) {
        const targetRegion: Region = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          ...(expanded ? ZOOMED_IN_DELTA : ZOOMED_OUT_DELTA),
        };
        mapRef.current.animateToRegion(targetRegion, 600);
      }
    },
    [userLocation],
  );

  return {
    mapRef,
    userLocation,
    handleLocationUpdate,
    handleModalStateChange,
  };
};
