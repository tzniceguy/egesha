import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useParkingStore } from "@/stores/parking";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const ParkingLotDetails = () => {
  const router = useRouter();
  const { selectedLot, availableSpots, selectLot } = useParkingStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  if (!selectedLot) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onClose={() => selectLot(null)}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{selectedLot.name}</Text>
        <Text style={styles.address}>{selectedLot.address}</Text>
        <Text style={styles.spots}>
          {selectedLot.available_spots_count} spots available
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => selectLot(null)}
        >
          <Ionicons name="close-circle" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.spotsContainer}>
          {availableSpots.map((spot) => (
            <View key={spot.id} style={styles.spot}>
              <Text>{spot.spot_number}</Text>
              <Text>{spot.spot_type}</Text>
              <Text>Tsh {spot.hourly_rate}/hr</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() =>
                  router.push({
                    pathname: `/bookings/${spot.id}`,
                    params: { spot: JSON.stringify(spot) },
                  })
                }
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
    color: "gray",
  },
  spots: {
    fontSize: 18,
    marginVertical: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  spotsContainer: {
    marginTop: 20,
    width: "100%",
  },
  spot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  bookButton: {
    backgroundColor: "#667eea",
    padding: 10,
    borderRadius: 5,
  },
  bookButtonText: {
    color: "white",
  },
});

export default ParkingLotDetails;
