// components/parking-lot-details.tsx
import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { useParkingStore } from "@/stores/parking";

interface ParkingLotDetailsProps {
  onNavigate?: (destination: { latitude: number; longitude: number }) => void;
}

const ParkingLotDetails = ({ onNavigate }: ParkingLotDetailsProps) => {
  const { selectedLot, clearSelection } = useParkingStore();

  if (!selectedLot) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedLot.name}</Text>
      <Text>Available spots: {selectedLot.available_spots_count}</Text>
      <Text>Price: {selectedLot.price_per_hour} per hour</Text>

      <View style={styles.buttonContainer}>
        <Button title="Close" onPress={clearSelection} color="#666" />
        {onNavigate && (
          <Button
            title="Navigate"
            onPress={() =>
              onNavigate({
                latitude: parseFloat(selectedLot.latitude),
                longitude: parseFloat(selectedLot.longitude),
              })
            }
            color="#1a73e8"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
});

export default ParkingLotDetails;
