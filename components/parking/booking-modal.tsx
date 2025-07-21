import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { ParkingLot, ParkingSpot } from "@/lib/types";
import { styles } from "./styles";
import { usePaymentStore } from "@/stores/payment";

interface BookingModalProps {
  bookingModalVisible: boolean;
  setBookingModalVisible: (visible: boolean) => void;
  selectedSpot: ParkingSpot | null;
  parkingLotData: ParkingLot;
  vehicle: string;
  setVehicle: (vehicle: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  calculatedPrice: number;
  confirmBooking: (startTime: Date, endTime: Date) => void;
  isBookingLoading: boolean;
}

// Custom DateTime Picker Component
interface CustomDateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  label: string;
  placeholder?: string;
  style?: any;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  label,
  placeholder = "Select date & time",
  style,
}) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const showPicker = () => {
    setShow(true);
  };

  const hidePicker = () => {
    setShow(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      hidePicker();
      return;
    }

    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);

    if (event.type === "set") {
      onChange(currentDate);
      hidePicker();
    }
  };

  const formatDateTime = (date: Date | null): string => {
    if (!date) return placeholder;

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    };

    return date.toLocaleString("en-GB", options).replace(",", " -");
  };

  return (
    <View style={[styles.inputGroup, style]}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={showPicker}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.dateTimeButtonText, !value && styles.placeholderText]}
        >
          {formatDateTime(value)}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#6b7280" />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={tempDate}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          is24Hour={true}
        />
      )}
    </View>
  );
};

export default function BookingModal({
  bookingModalVisible,
  setBookingModalVisible,
  selectedSpot,
  parkingLotData,
  vehicle,
  setVehicle,
  phone,
  setPhone,
  calculatedPrice,
  confirmBooking,
  isBookingLoading,
}: BookingModalProps) {
  const { initiatePayment, isLoading: isPaymentLoading } = usePaymentStore();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [price, setPrice] = useState<number>(calculatedPrice);

  // Helper function to convert local time to UTC with minute precision
  const toUTCDate = (date: Date): Date => {
    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
      ),
    );
    return utcDate;
  };

  // Calculate duration and price when times change
  useEffect(() => {
    if (startTime && endTime && startTime < endTime) {
      // Convert to UTC with minute precision
      const utcStart = toUTCDate(startTime);
      const utcEnd = toUTCDate(endTime);

      const durationInHours =
        (utcEnd.getTime() - utcStart.getTime()) / (1000 * 60 * 60);
      setDuration(durationInHours);

      const hourlyRate = selectedSpot?.hourly_rate;
      const calculatedAmount = Math.ceil(durationInHours) * hourlyRate;
      setPrice(calculatedAmount);
    } else {
      setDuration(0);
      setPrice(0);
    }
  }, [startTime, endTime, selectedSpot]);

  const handleConfirmBooking = async () => {
    if (!startTime || !endTime) {
      Alert.alert("Error", "Please select both start and end times");
      return;
    }

    // Convert to UTC with minute precision before validation
    const utcStart = toUTCDate(startTime);
    const utcEnd = toUTCDate(endTime);

    if (utcStart >= utcEnd) {
      Alert.alert("Error", "End time must be after start time");
      return;
    }

    const timeDiff = (utcEnd.getTime() - utcStart.getTime()) / (1000 * 60 * 60);
    if (timeDiff > 24) {
      Alert.alert("Error", "Parking duration cannot exceed 24 hours");
      return;
    }

    if (timeDiff < 0.5) {
      Alert.alert("Error", "Minimum parking duration is 30 minutes");
      return;
    }

    if (!vehicle.trim()) {
      Alert.alert("Error", "Please enter your vehicle license plate");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    await confirmBooking(utcStart, utcEnd);
  };

  const getMinEndTime = (): Date => {
    if (startTime) {
      const minEnd = new Date(startTime);
      minEnd.setMinutes(minEnd.getMinutes() + 30); // Minimum 30 minutes duration
      return minEnd;
    }
    return new Date();
  };

  const getMaxDate = (): Date => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // 7 days from now
    return maxDate;
  };

  const resetTimes = () => {
    setStartTime(null);
    setEndTime(null);
    setDuration(0);
    setPrice(0);
  };

  const handleClose = () => {
    resetTimes();
    setBookingModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={bookingModalVisible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Book Parking Spot {selectedSpot?.spot_number}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalDescription}>
              Complete your booking for {selectedSpot?.spot_type} spot at{" "}
              {parkingLotData.name}
            </Text>

            <View style={styles.formContainer}>
              {/* Start Time Picker */}
              <CustomDateTimePicker
                label="Start Date & Time"
                value={startTime}
                onChange={setStartTime}
                minimumDate={new Date()}
                maximumDate={getMaxDate()}
                placeholder="Select start time"
              />

              {/* End Time Picker */}
              <CustomDateTimePicker
                label="End Date & Time"
                value={endTime}
                onChange={setEndTime}
                minimumDate={getMinEndTime()}
                maximumDate={getMaxDate()}
                placeholder="Select end time"
              />

              {/* Duration Display */}
              {startTime && endTime && startTime < endTime && (
                <View style={styles.durationInfo}>
                  <Text style={styles.durationText}>
                    Duration: {duration.toFixed(1)} hours
                  </Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle License Plate</Text>
                <TextInput
                  style={styles.input}
                  value={vehicle}
                  onChangeText={setVehicle}
                  placeholder="License plate number"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="characters"
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
                  TSh {price.toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (!startTime ||
                    !endTime ||
                    !vehicle.trim() ||
                    !phone.trim()) &&
                    styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmBooking}
                disabled={
                  isBookingLoading ||
                  isPaymentLoading ||
                  !startTime ||
                  !endTime ||
                  !vehicle.trim() ||
                  !phone.trim()
                }
              >
                {isBookingLoading || isPaymentLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Confirm Booking - TSh {price.toLocaleString()}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
