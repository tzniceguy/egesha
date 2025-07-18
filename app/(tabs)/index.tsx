import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapComponent from "@/components/map-component";
import SearchModal from "@/components/search-component";
import { useMapLogic } from "@/hooks/use-map-logic";
import { INITIAL_MAP_REGION } from "@/lib/constants";
import { useParkingStore } from "@/stores/parking";
import ParkingLotDetails from "@/components/parking-lot-details";
import {
  getNearbyParkingLots,
  searchParkingLocations,
} from "@/services/parking";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { mapRef, handleLocationUpdate, handleModalStateChange, userLocation } =
    useMapLogic();
  const { nearbyLots, selectedLot, setSearchResults } = useParkingStore();
  const [destination, setDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableAt, setAvailableAt] = useState<string | undefined>(undefined);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: [
      "parkingSearch",
      debouncedSearchQuery,
      userLocation?.latitude,
      userLocation?.longitude,
      availableAt,
    ],
    queryFn: () =>
      searchParkingLocations({
        query: debouncedSearchQuery,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 5000,
        available_at: availableAt,
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

  const handleSearch = (query: string, available_at?: string) => {
    setSearchQuery(query);
    setAvailableAt(available_at);
  };

  const handleResultPress = (result) => {
    setDestination({
      latitude: result.latitude,
      longitude: result.longitude,
    });

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  };

  const handleNavigate = (destination) => {
    setDestination(destination);
    if (mapRef.current && userLocation) {
      mapRef.current.calculateRoute(destination);
    }
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
      />

      <SearchModal
        onStateChange={handleModalStateChange}
        onSearch={handleSearch}
        searchResults={nearbyLots}
        onResultPress={handleResultPress}
        isSearching={isSearching}
      />

      <ParkingLotDetails onNavigate={handleNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;
