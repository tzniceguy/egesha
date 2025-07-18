import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useParkingStore } from "@/stores/parking";
import { useVehicleStore } from "@/stores/vehicle";
import { createBooking } from "@/services/booking";
import { addHours, formatISO } from "date-fns";

interface ParkingLotDetailsProps {
  onNavigate?: (destination: { latitude: number; longitude: number }) => void;
}

const ParkingLotDetails = ({ onNavigate }: ParkingLotDetailsProps) => {
  const {
    selectedLot,
    availableSpots,
    selectedSpot,
    selectSpot,
    clearSelection,
  } = useParkingStore();
  const { vehicles } = useVehicleStore();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = async () => {
    if (!selectedSpot || !vehicles.length) {
      Alert.alert(
        "Error",
        "Please select a spot and make sure you have a registered vehicle.",
      );
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        spot: selectedSpot.id,
        vehicle: vehicles[0].id, // Assuming the first vehicle
        start_time: formatISO(new Date()),
        end_time: formatISO(addHours(new Date(), 1)), // Booking for 1 hour
      };
      await createBooking(bookingData);
      setBookingSuccess(true);
      Alert.alert("Success", "Your booking has been confirmed.");
    } catch (error) {
      console.error("Booking failed:", error);
      Alert.alert("Error", "Could not complete your booking.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleClose = () => {
    clearSelection();
    setBookingSuccess(false);
  };

  if (!selectedLot) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedLot.name}</Text>
      {!bookingSuccess ? (
        <>
          <Text style={styles.subtitle}>Select a Spot:</Text>
          <ScrollView style={styles.spotsContainer}>
            {availableSpots.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                style={[
                  styles.spot,
                  selectedSpot?.id === spot.id && styles.selectedSpot,
                ]}
                onPress={() => selectSpot(spot)}
              >
                <Text style={styles.spotText}>{spot.spot_number}</Text>
                <Text style={styles.spotText}>${spot.hourly_rate}/hr</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={handleClose} color="#666" />
            <Button
              title={isBooking ? "Booking..." : "Book Now"}
              onPress={handleBooking}
              disabled={!selectedSpot || isBooking}
              color="#1a73e8"
            />
          </View>
        </>
      ) : (
        <>
          <Text>Your booking is confirmed!</Text>
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={handleClose} color="#666" />
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
        </>
      )}
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
    maxHeight: "40%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  spotsContainer: {
    maxHeight: 150,
  },
  spot: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedSpot: {
    borderColor: "#1a73e8",
    backgroundColor: "#e8f0fe",
  },
  spotText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
});

export default ParkingLotDetails;
