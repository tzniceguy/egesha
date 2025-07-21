import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "@/services/booking";
import { format, parseISO } from "date-fns";
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Hash,
  DollarSign,
  AlertCircle,
} from "lucide-react-native";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError || !booking) {
    return (
      <View style={styles.centered}>
        <AlertCircle size={24} color="#ef4444" style={styles.errorIcon} />
        <Text style={styles.errorText}>Failed to load booking details</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Extract data from the booking object
  const { parking_lot, parking_spot, vehicle, start_time, end_time, cost } =
    booking;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{parking_lot.name}</Text>
          <View style={styles.infoRow}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.infoText}>{parking_lot.address}</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.infoRow}>
            <Car size={16} color="#6b7280" />
            <Text style={styles.infoText}>{vehicle.license_plate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Hash size={16} color="#6b7280" />
            <Text style={styles.infoText}>Spot {parking_spot.spot_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Calendar size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {format(parseISO(start_time), "MMM dd, yyyy")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {format(parseISO(start_time), "HH:mm")} -{" "}
              {format(parseISO(end_time), "HH:mm")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <DollarSign size={16} color="#6b7280" />
            <Text style={styles.infoText}>Tsh {cost}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
});
