import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "@/services/booking";
import MapView, { Marker } from "react-native-maps";
import { MapViewRoute } from "react-native-maps-routes";
import { format, parseISO } from "date-fns";
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Hash,
  DollarSign,
  Navigation,
  AlertCircle,
} from "lucide-react-native";
import * as Location from "expo-location";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Location permission denied");
          setIsLocationLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrentLocation(location);
        setLocationError(null);
      } catch (error) {
        setLocationError("Failed to get current location");
        console.error("Location error:", error);
      } finally {
        setIsLocationLoading(false);
      }
    })();
  }, []);

  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id as string),
    enabled: !!id,
  });

  if (isLoading || isLocationLoading) {
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
        <Text style={styles.errorText}>Failed to load booking details.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.centered}>
        <AlertCircle size={24} color="#ef4444" style={styles.errorIcon} />
        <Text style={styles.errorText}>{locationError}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { parking_lot, parking_spot, vehicle, start_time, end_time, cost } =
    booking;

  const origin = currentLocation
    ? {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      }
    : null;

  const destination = {
    latitude: parseFloat(parking_lot.latitude),
    longitude: parseFloat(parking_lot.longitude),
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Error",
        "Could not open navigation app. Please install Google Maps."
      );
    });
  };

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

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: destination.latitude,
              longitude: destination.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {origin && GOOGLE_MAPS_APIKEY && (
              <MapViewRoute
                origin={origin}
                destination={destination}
                apiKey={GOOGLE_MAPS_APIKEY}
                strokeWidth={4}
                strokeColor="#3b82f6"
              />
            )}
            <Marker
              coordinate={destination}
              title={parking_lot.name}
              pinColor="#ef4444"
            />
            {origin && (
              <Marker
                coordinate={origin}
                title="Your Location"
                pinColor="#10b981"
              />
            )}
          </MapView>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={openInMaps}
          disabled={!origin}
        >
          <Navigation size={20} color="#ffffff" />
          <Text style={styles.navigateButtonText}>Start Navigation</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
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
    marginBottom: 20,
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
  mapContainer: {
    height: 300,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 8,
  },
  navigateButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});
