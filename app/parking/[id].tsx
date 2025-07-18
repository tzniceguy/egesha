import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useParkingStore } from "@/stores/parking";
import { useBookingStore } from "@/stores/booking";
import { useAuthStore } from "@/stores/auth";
import { getParkingLot } from "@/services/parking";
import { ParkingLot, ParkingSpot } from "@/lib/types";

const { width } = Dimensions.get("window");

export default function ParkingLotDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    selectedLot,
    availableSpots,
    isLoading,
    selectLot,
    fetchAvailableSpots,
  } = useParkingStore();
  const { createBooking, isLoading: isBookingLoading } = useBookingStore();

  const [parkingLotData, setParkingLotData] = useState<ParkingLot | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [duration, setDuration] = useState("1");
  const [vehicle, setVehicle] = useState("");
  const [phone, setPhone] = useState(user?.phoneNumber || "");

  useEffect(() => {
    const fetchParkingLot = async () => {
      try {
        const lot = await getParkingLot(Number(id));
        setParkingLotData(lot);
        selectLot(lot);
        fetchAvailableSpots(Number(id));
      } catch (error) {
        console.error("Failed to fetch parking lot:", error);
        Alert.alert("Error", "Failed to load parking lot details.");
      }
    };

    if (id) {
      fetchParkingLot();
    }
  }, [id]);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const handleBooking = () => {
    if (selectedSpot) {
      setBookingModalVisible(true);
    }
  };

  const confirmBooking = async () => {
    if (!vehicle || !phone || !selectedSpot || !parkingLotData) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const bookingData = {
      parking_lot: parkingLotData.id,
      parking_spot: selectedSpot.id,
      start_time: new Date().toISOString(),
      end_time: new Date(
        new Date().getTime() + parseInt(duration) * 60 * 60 * 1000,
      ).toISOString(),
      vehicle_license_plate: vehicle,
      phone_number: phone,
    };

    try {
      await createBooking(bookingData);
      Alert.alert(
        "Booking Confirmed",
        `Your parking spot ${selectedSpot.spot_number} has been booked successfully!`,
        [
          {
            text: "OK",
            onPress: () => {
              setBookingModalVisible(false);
              setSelectedSpot(null);
              setVehicle("");
              setDuration("1");
              router.push("/bookings");
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Booking Failed", "Could not complete your booking.");
    }
  };

  const calculatedPrice = selectedSpot
    ? selectedSpot.hourly_rate * parseInt(duration)
    : 0;

  if (isLoading || !parkingLotData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{parkingLotData.name}</Text>
              <View style={styles.addressContainer}>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text style={styles.address}>{parkingLotData.address}</Text>
              </View>
            </View>
            <View
              style={[
                styles.badge,
                parkingLotData.is_active
                  ? styles.activeBadge
                  : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  parkingLotData.is_active
                    ? styles.activeBadgeText
                    : styles.inactiveBadgeText,
                ]}
              >
                {parkingLotData.is_active ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={16} color="#6b7280" />
              <Text style={styles.infoText}>
                Operator: {parkingLotData.operator_name}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.infoText}>
                {formatTime(parkingLotData.opening_hours)} -{" "}
                {formatTime(parkingLotData.closing_hours)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="car-outline" size={16} color="#6b7280" />
              <Text style={styles.infoText}>
                {parkingLotData.available_spots_count} spots available
              </Text>
            </View>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={32} color="#9ca3af" />
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapCoords}>
              Lat: {parkingLotData.latitude}, Lng: {parkingLotData.longitude}
            </Text>
          </View>
        </View>

        {/* Parking Spots */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Parking Spots</Text>
          <Text style={styles.cardDescription}>
            Select a parking spot to book
          </Text>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="ellipse" size={16} color="#ef4444" />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="ellipse" size={16} color="#3b82f6" />
              <Text style={styles.legendText}>Selected</Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Spots Grid */}
          <View style={styles.spotsGrid}>
            {availableSpots.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                style={[
                  styles.spotCard,
                  !spot.is_available && styles.spotCardDisabled,
                  selectedSpot?.id === spot.id && styles.spotCardSelected,
                ]}
                onPress={() => spot.is_available && handleSpotSelect(spot)}
                disabled={!spot.is_available}
              >
                <View style={styles.spotIcon}>
                  {spot.is_available ? (
                    selectedSpot?.id === spot.id ? (
                      <Ionicons name="ellipse" size={24} color="#3b82f6" />
                    ) : (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#10b981"
                      />
                    )
                  ) : (
                    <Ionicons name="ellipse" size={24} color="#ef4444" />
                  )}
                </View>
                <Text style={styles.spotId}>{spot.spot_number}</Text>
                <Text style={styles.spotType}>{spot.spot_type}</Text>
                <Text style={styles.spotPrice}>TSh {spot.hourly_rate}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Booking Section */}
          {selectedSpot && (
            <View style={styles.bookingSection}>
              <View style={styles.bookingInfo}>
                <View>
                  <Text style={styles.bookingTitle}>
                    Selected Spot: {selectedSpot.spot_number}
                  </Text>
                  <Text style={styles.bookingSubtitle}>
                    {selectedSpot.spot_type} - TSh {selectedSpot.hourly_rate}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={handleBooking}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Book Parking Spot {selectedSpot?.spot_number}
              </Text>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Complete your booking for {selectedSpot?.spot_type} spot at{" "}
              {parkingLotData.name}
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Duration</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={duration}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDuration(itemValue)}
                  >
                    <Picker.Item label="1 hour" value="1" />
                    <Picker.Item label="2 hours" value="2" />
                    <Picker.Item label="4 hours" value="4" />
                    <Picker.Item label="8 hours" value="8" />
                    <Picker.Item label="Full day" value="24" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle License Plate</Text>
                <TextInput
                  style={styles.input}
                  value={vehicle}
                  onChangeText={setVehicle}
                  placeholder="License plate number"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Your phone number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.separator} />

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>
                  TSh {calculatedPrice.toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmBooking}
                disabled={isBookingLoading}
              >
                {isBookingLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  address: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: "#3b82f6",
  },
  inactiveBadge: {
    backgroundColor: "#e5e7eb",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeBadgeText: {
    color: "#ffffff",
  },
  inactiveBadgeText: {
    color: "#6b7280",
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
  },
  mapCoords: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#374151",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  spotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  spotCard: {
    width: (width - 80) / 3,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  spotCardDisabled: {
    opacity: 0.5,
  },
  spotCardSelected: {
    borderColor: "#3b82f6",
    borderWidth: 2,
    backgroundColor: "#eff6ff",
  },
  spotIcon: {
    marginBottom: 8,
  },
  spotId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  spotType: {
    fontSize: 12,
    color: "#6b7280",
  },
  spotPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginTop: 4,
  },
  bookingSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
  },
  bookingInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  bookingSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  bookButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
  },
  picker: {
    height: 50,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
