import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapComponent from "@/components/map-component";
import SearchModal from "@/components/search-component";
import { useMapLogic } from "@/hooks/use-map-logic";
import { INITIAL_MAP_REGION } from "@/lib/constants";
import { useParkingStore } from "@/stores/parking";
import ParkingLotDetails from "@/components/parking-lot-details";

const Page = () => {
  const { mapRef, handleLocationUpdate, handleModalStateChange, userLocation } =
    useMapLogic();
  const { nearbyLots, fetchNearbyLots } = useParkingStore();

  useEffect(() => {
    if (userLocation) {
      fetchNearbyLots(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, fetchNearbyLots]);

  return (
    <View style={styles.container}>
      <MapComponent
        ref={mapRef}
        onLocationUpdate={handleLocationUpdate}
        initialRegion={INITIAL_MAP_REGION}
        parkingLots={nearbyLots}
      />
      <SearchModal onStateChange={handleModalStateChange} />
      <ParkingLotDetails />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;
