import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "@/lib/styles/colors";

interface ParkingMarkerProps {
  available: number;
  selected?: boolean;
  price?: number;
}

const ParkingMarker = ({ available, selected, price }: ParkingMarkerProps) => {
  // Determine marker color based on availability
  const getMarkerColor = () => {
    if (selected) return colors.primary;
    if (available === 0) return colors.danger;
    if (available < 5) return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      {/* Outer marker circle */}
      <View
        style={[
          styles.marker,
          { backgroundColor: getMarkerColor() },
          selected && styles.selectedMarker,
        ]}
      >
        {/* Availability count */}
        <Text style={styles.availabilityText}>{available}</Text>
      </View>

      {/* Price indicator */}
      {price && (
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${price}</Text>
        </View>
      )}

      {/* Marker point */}
      <View
        style={[styles.markerPoint, { borderTopColor: getMarkerColor() }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  selectedMarker: {
    transform: [{ scale: 1.2 }],
    elevation: 8,
  },
  availabilityText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  priceBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  priceText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.text,
  },
  markerPoint: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopWidth: 12,
    marginTop: -4,
  },
});

export default ParkingMarker;
