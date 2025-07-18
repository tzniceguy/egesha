import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getParkingLot, getAvailableSpots } from "@/services/parking";
import { useVehicleStore } from "@/stores/vehicle";
import { createBooking } from "@/services/booking";
import { addHours, formatISO } from "date-fns";
import { ParkingSpot } from "@/lib/types";

const ParkingDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { vehicles } = useVehicleStore();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { data: lot, isLoading: isLotLoading } = useQuery({
    queryKey: ["parkingLot", id],
    queryFn: () => getParkingLot(Number(id)),
    enabled: !!id,
  });

  const { data: availableSpots, isLoading: areSpotsLoading } = useQuery({
    queryKey: ["availableSpots", id],
    queryFn: () => getAvailableSpots(Number(id)),
    enabled: !!id,
  });

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

  if (isLotLoading || areSpotsLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!lot) {
    return (
      <View style={styles.container}>
        <Text>Parking lot not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lot.name}</Text>
      {!bookingSuccess ? (
        <>
          <Text style={styles.subtitle}>Select a Spot:</Text>
          <ScrollView style={styles.spotsContainer}>
            {availableSpots?.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                style={[
                  styles.spot,
                  selectedSpot?.id === spot.id && styles.selectedSpot,
                ]}
                onPress={() => setSelectedSpot(spot)}
              >
                <Text style={styles.spotText}>{spot.spot_number}</Text>
                <Text style={styles.spotText}>${spot.hourly_rate}/hr</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button title="Back" onPress={() => router.back()} color="#666" />
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
            <Button title="Done" onPress={() => router.back()} color="#666" />
            {/* You can add a navigate button here if you want to navigate to the map */}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  spotsContainer: {
    flex: 1,
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

export default ParkingDetailsPage;
