
import React from "react";
import {
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ParkingLot } from "@/lib/types";
import { styles } from "./styles";

interface HeaderCardProps {
  parkingLotData: ParkingLot;
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function HeaderCard({ parkingLotData }: HeaderCardProps) {
  return (
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
  );
}
