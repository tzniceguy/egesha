
import React, { useState } from "react";
import {
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  View,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useBookingStore } from "@/stores/booking";
import { usePaymentStore } from "@/stores/payment";
import { useAuthStore } from "@/stores/auth";
import { getParkingLot, getAvailableSpots } from "@/services/parking";
import { ParkingSpot } from "@/lib/types";
import HeaderCard from "./header-card";
import MapPlaceholder from "./map-placeholder";
import ParkingSpots from "./parking-spots";
import BookingModal from "./booking-modal";
import LoadingIndicator from "./loading-indicator";
import { styles } from "./styles";

export default function Main() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { createBooking, isLoading: isBookingLoading } = useBookingStore();
  const { initiatePayment, isLoading: isPaymentLoading } = usePaymentStore();

  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [phone, setPhone] = useState(user?.phoneNumber || "");

  const {
    data: parkingLotData,
    isLoading: isLotLoading,
    isError: isLotError,
  } = useQuery({
    queryKey: ["parkingLot", id],
    queryFn: () => getParkingLot(Number(id)),
    enabled: !!id,
  });

  const {
    data: availableSpots,
    isLoading: areSpotsLoading,
    isError: areSpotsError,
  } = useQuery({
    queryKey: ["availableSpots", id],
    queryFn: () => getAvailableSpots(Number(id)),
    enabled: !!id,
  });

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const handleBooking = () => {
    if (selectedSpot) {
      setBookingModalVisible(true);
    }
  };

  const confirmBooking = async (startTime: Date, endTime: Date) => {
    if (!vehicle || !phone || !selectedSpot || !parkingLotData) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const bookingData = {
      license_plate: vehicle,
      phone_number: phone,
      parking_lot: parkingLotData.id,
      parking_spot: selectedSpot.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    };

    try {
      const booking = await createBooking(bookingData);
      const paymentData = {
        booking_id: booking.id,
        phone_number: phone,
      };
      await initiatePayment(paymentData);
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
              router.push("/bookings");
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Booking Failed", "Could not complete your booking.");
    }
  };

  if (isLotLoading || areSpotsLoading) {
    return <LoadingIndicator />;
  }

  if (isLotError || areSpotsError) {
    return (
      <View style={styles.container}>
        <Text>Error loading parking information.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HeaderCard parkingLotData={parkingLotData} />
        <MapPlaceholder
          latitude={parkingLotData.latitude}
          longitude={parkingLotData.longitude}
        />
        <ParkingSpots
          availableSpots={availableSpots || []}
          selectedSpot={selectedSpot}
          handleSpotSelect={handleSpotSelect}
          handleBooking={handleBooking}
        />
      </ScrollView>

      {parkingLotData && (
        <BookingModal
          bookingModalVisible={bookingModalVisible}
          setBookingModalVisible={setBookingModalVisible}
          selectedSpot={selectedSpot}
          parkingLotData={parkingLotData}
          vehicle={vehicle}
          setVehicle={setVehicle}
          phone={phone}
          setPhone={setPhone}
          calculatedPrice={0} // This will be calculated inside the modal
          confirmBooking={confirmBooking}
          isBookingLoading={isBookingLoading || isPaymentLoading}
        />
      )}
    </SafeAreaView>
  );
}

