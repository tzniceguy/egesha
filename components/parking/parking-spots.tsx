
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ParkingSpot } from "@/lib/types";
import { styles } from "./styles";

interface ParkingSpotsProps {
  availableSpots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  handleSpotSelect: (spot: ParkingSpot) => void;
  handleBooking: () => void;
}

export default function ParkingSpots({
  availableSpots,
  selectedSpot,
  handleSpotSelect,
  handleBooking,
}: ParkingSpotsProps) {
  return (
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
  );
}
