import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapComponent from "@/components/map-component";
import SearchModal from "@/components/search-component";
import { useMapLogic } from "@/hooks/use-map-logic";
import { INITIAL_MAP_REGION } from "@/lib/constants";
import { useParkingStore } from "@/stores/parking";
import {
  getNearbyParkingLots,
  searchParkingLocations,
} from "@/services/parking";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const Page = () => {
  const {
    mapRef,
    handleLocationUpdate,
    handleModalStateChange,
    userLocation,
  } = useMapLogic();
  const { nearbyLots, selectLot, setSearchResults } = useParkingStore();
  const [destination, setDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const router = useRouter();

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: [
      "parkingSearch",
      debouncedSearchQuery,
      userLocation?.latitude,
      userLocation?.longitude,
    ],
    queryFn: () =>
      searchParkingLocations({
        query: debouncedSearchQuery,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 5000,
      }),
    enabled: !!userLocation && debouncedSearchQuery.length > 2,
  });

  const { data: nearbyParkingLots, isFetching: isFetchingNearby } = useQuery({
    queryKey: ["nearbyLots", userLocation?.latitude, userLocation?.longitude],
    queryFn: () =>
      getNearbyParkingLots({
        lat: userLocation.latitude,
        lon: userLocation.longitude,
      }),
    enabled: !!userLocation,
  });

  useEffect(() => {
    if (searchResults) {
      setSearchResults(searchResults);
    } else if (nearbyParkingLots) {
      setSearchResults(nearbyParkingLots);
    }
  }, [searchResults, nearbyParkingLots, setSearchResults]);

  const handleResultPress = (result) => {
    selectLot(result);
    router.push(`/parking/${result.id}`);
  };

  return (
    <View style={styles.container}>
      <MapComponent
        ref={mapRef}
        onLocationUpdate={handleLocationUpdate}
        initialRegion={INITIAL_MAP_REGION}
        parkingLots={nearbyLots}
        destination={destination}
        showRoute={!!destination}
        onMarkerPress={(lot) => router.push(`/parking/${lot.id}`)}
      />

      <SearchModal
        onStateChange={handleModalStateChange}
        onSearch={setSearchQuery}
        searchResults={nearbyLots}
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
