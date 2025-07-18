import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { ParkingLot, ParkingSpot } from "@/lib/types";
import { styles } from "./styles";

interface BookingModalProps {
  bookingModalVisible: boolean;
  setBookingModalVisible: (visible: boolean) => void;
  selectedSpot: ParkingSpot | null;
  parkingLotData: ParkingLot;
  duration: string;
  setDuration: (duration: string) => void;
  vehicle: string;
  setVehicle: (vehicle: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  calculatedPrice: number;
  confirmBooking: () => void;
  isBookingLoading: boolean;
}

export default function BookingModal({
  bookingModalVisible,
  setBookingModalVisible,
  selectedSpot,
  parkingLotData,
  duration,
  setDuration,
  vehicle,
  setVehicle,
  phone,
  setPhone,
  calculatedPrice,
  confirmBooking,
  isBookingLoading,
}: BookingModalProps) {
  return (
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
  );
}
