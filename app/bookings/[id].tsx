import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { ParkingSpot } from "@/lib/types";
import Header from "@/components/header";
import { useBookingStore } from "@/stores/booking";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function BookingScreen() {
  const router = useRouter();
  const { spot } = useLocalSearchParams<{ spot: string }>();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const { createBooking, isLoading } = useBookingStore();

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Mock vehicle data for now
  const [selectedVehicle, setSelectedVehicle] = useState(1);

  useEffect(() => {
    if (spot) {
      setSelectedSpot(JSON.parse(spot));
    }
  }, [spot]);

  const handleBooking = async () => {
    if (!selectedSpot) return;

    try {
      await createBooking({
        parking_spot: selectedSpot.id,
        vehicle: selectedVehicle,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      });
      Alert.alert("Success", "Booking created successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create booking.");
    }
  };

  if (!selectedSpot) {
    return (
      <View style={styles.center}>
        <Text>No spot selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Book Spot ${selectedSpot.spot_number}`}
        showBackButton={true}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Select Time and Vehicle</Text>

        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
            <Text>Start Time: {startTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                setShowStartTimePicker(false);
                if (date) setStartTime(date);
              }}
            />
          )}
        </View>

        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
            <Text>End Time: {endTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                setShowEndTimePicker(false);
                if (date) setEndTime(date);
              }}
            />
          )}
        </View>

        {/* Mock Vehicle Selector */}
        <View style={styles.vehicleSelector}>
          <Text>Selected Vehicle ID: {selectedVehicle}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleBooking}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timeContainer: {
    marginVertical: 10,
  },
  vehicleSelector: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
