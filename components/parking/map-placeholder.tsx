
import React from "react";
import {
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

interface MapPlaceholderProps {
    latitude: number;
    longitude: number;
}

export default function MapPlaceholder({ latitude, longitude }: MapPlaceholderProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Location</Text>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={32} color="#9ca3af" />
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapCoords}>
          Lat: {latitude}, Lng: {longitude}
        </Text>
      </View>
    </View>
  );
}
