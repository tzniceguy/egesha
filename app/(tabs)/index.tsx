import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapComponent from "@/components/map-component";
import SearchModal from "@/components/search-component";
import { useMapLogic } from "@/hooks/use-map-logic";
import { INITIAL_MAP_REGION } from "@/lib/constants";
import {
  getNearbyParkingLots,
  searchParkingLocations,
} from "@/services/parking";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const Page = () => {
  const router = useRouter();
  const { mapRef, handleLocationUpdate, userLocation } = useMapLogic();
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [destination, setDestination] = useState(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch nearby parking lots
  const { data: parkingLots = [], isLoading: isLoadingNearby } = useQuery({
    queryKey: ["nearbyLots", userLocation?.latitude, userLocation?.longitude],
    queryFn: () =>
      getNearbyParkingLots({
        lat: userLocation?.latitude,
        lon: userLocation?.longitude,
      }),
    enabled: !!userLocation,
  });

  // Search functionality
  const { data: searchResults = [], isFetching: isSearching } = useQuery({
    queryKey: [
      "parkingSearch",
      debouncedSearchQuery,
      userLocation?.latitude,
      userLocation?.longitude,
    ],
    queryFn: () =>
      searchParkingLocations({
        query: debouncedSearchQuery,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        radius: 5000,
      }),
    enabled: !!userLocation && debouncedSearchQuery.length > 2,
  });

  // Determine which lots to display
  const displayedLots = searchQuery.length > 2 ? searchResults : parkingLots;

  const handleResultPress = (result) => {
    setDestination({
      latitude: parseFloat(result.latitude),
      longitude: parseFloat(result.longitude),
    });
    router.push(`/parking/${result.id}`);
  };

  const handleMarkerPress = (lot) => {
    router.push(`/parking/${lot.id}`);
    setDestination({
      latitude: parseFloat(lot.latitude),
      longitude: parseFloat(lot.longitude),
    });
  };

  return (
    <View style={styles.container}>
      <MapComponent
        ref={mapRef}
        onLocationUpdate={handleLocationUpdate}
        initialRegion={INITIAL_MAP_REGION}
        parkingLots={displayedLots}
        destination={destination}
        showRoute={!!destination}
        onMarkerPress={handleMarkerPress}
      />

      <SearchModal
        onSearch={setSearchQuery}
        searchResults={displayedLots}
        onResultPress={handleResultPress}
        isSearching={isSearching}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;
