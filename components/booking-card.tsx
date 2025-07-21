import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { format, parseISO } from "date-fns";
import { MapPin, Calendar, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";

// Types
type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "unknown";

interface BookingCardProps {
  booking: {
    id: string;
    date: string;
    status: BookingStatus;
    location: string;
    cost: number;
    start_time: string;
    end_time: string;
    imageUrl?: string;
  };
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const router = useRouter();
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    router.push(`/bookings/${booking.id}`);
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "completed":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          styles.shadow,
        ]}
      >
        {/* Left Section */}
        <View style={styles.leftContent}>
          {booking.imageUrl ? (
            <Image source={{ uri: booking.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <MapPin size={24} color="#757575" />
            </View>
          )}

          <View style={styles.details}>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#171a1f" />
              <Text style={styles.location}>{booking.location}</Text>
            </View>

            <View style={styles.dateContainer}>
              <Calendar size={14} color="#757575" />
              <Text style={styles.date}>
                {format(parseISO(booking.start_time), "MMM dd, yyyy")}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={14} color="#757575" />
              <Text style={styles.time}>
                {format(parseISO(booking.start_time), "HH:mm")} -{" "}
                {format(parseISO(booking.end_time), "HH:mm")}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.rightContent}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(booking.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.price}>Tsh {booking.cost}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    marginLeft: 12,
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171a1f",
    marginLeft: 6,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 13,
    color: "#757575",
    marginLeft: 4,
  },
  rightContent: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171a1f",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  time: {
    fontSize: 13,
    color: "#757575",
    marginLeft: 4,
  },
});

export default BookingCard;
