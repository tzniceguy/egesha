import React, { useState, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import MapComponent, { MapComponentRef } from "@/components/map-component"; // Import ref type
import SearchModal from "@/components/search-component";
import { Region } from "react-native-maps"; // Import Region type

// Define types (can be shared)
type LocationType = {
  latitude: number;
  longitude: number;
};

// Define zoom levels
const ZOOMED_IN_DELTA = { latitudeDelta: 0.005, longitudeDelta: 0.005 };
const ZOOMED_OUT_DELTA = { latitudeDelta: 0.02, longitudeDelta: 0.02 }; // Adjust as needed

// Initial region can also be defined here
const INITIAL_MAP_REGION = {
  latitude: -6.8235, // Dar es Salaam
  longitude: 39.2695,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Page = () => {
  const [isModalExpanded, setIsModalExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const mapRef = useRef<MapComponentRef>(null); // Ref for MapComponent

  // Callback for MapComponent to update user's location
  const handleLocationUpdate = useCallback(
    (location: LocationType | null) => {
      setUserLocation(location);
      // Optional: Move map to user's location when first found
      if (location && !isModalExpanded) {
        // Only move initially if modal isn't already open
        mapRef.current?.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          ...ZOOMED_OUT_DELTA, // Start zoomed out
        });
      } else if (!location) {
        // Handle case where location is lost or denied - maybe animate back to default?
        mapRef.current?.animateToRegion(INITIAL_MAP_REGION);
      }
    },
    [isModalExpanded],
  ); // Recreate callback if modal state changes (relevant for initial centering logic)

  // Callback for SearchModal state changes
  const handleModalStateChange = useCallback(
    (expanded: boolean) => {
      setIsModalExpanded(expanded);
      console.log(`Modal ${expanded ? "Expanded" : "Collapsed"}`); // Debug log

      if (userLocation && mapRef.current) {
        const targetRegion: Region = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          ...(expanded ? ZOOMED_IN_DELTA : ZOOMED_OUT_DELTA),
        };
        mapRef.current.animateToRegion(targetRegion, 600); // Animate over 600ms
      } else if (!userLocation) {
        // Optionally show a message or handle this case
      }
    },
    [userLocation],
  );

  return (
    <View style={styles.container}>
      <MapComponent
        ref={mapRef}
        onLocationUpdate={handleLocationUpdate}
        initialRegion={INITIAL_MAP_REGION}
      />
      <SearchModal onStateChange={handleModalStateChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;
