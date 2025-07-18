
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useParkingStore } from "@/stores/parking";
import { useBookingStore } from "@/stores/booking";
import { useAuthStore } from "@/stores/auth";
import { getParkingLot } from "@/services/parking";
import { ParkingLot, ParkingSpot } from "@/lib/types";
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
    return <LoadingIndicator />;
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
          availableSpots={availableSpots}
          selectedSpot={selectedSpot}
          handleSpotSelect={handleSpotSelect}
          handleBooking={handleBooking}
        />
      </ScrollView>

      <BookingModal
        bookingModalVisible={bookingModalVisible}
        setBookingModalVisible={setBookingModalVisible}
        selectedSpot={selectedSpot}
        parkingLotData={parkingLotData}
        duration={duration}
        setDuration={setDuration}
        vehicle={vehicle}
        setVehicle={setVehicle}
        phone={phone}
        setPhone={setPhone}
        calculatedPrice={calculatedPrice}
        confirmBooking={confirmBooking}
        isBookingLoading={isBookingLoading}
      />
    </SafeAreaView>
  );
}
