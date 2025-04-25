import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { bookings } from "@/lib/mockups/bookings";
import { format } from "date-fns";
import { Calendar, Clock, DollarSign } from "lucide-react-native";
import Header from "@/components/header";
import { useEffect, useState } from "react";

// Define booking type
interface Booking {
  id: string;
  location: string;
  date: Date;
  price: number;
  status: string;
  imageUrl?: string;
}

export default function BookingDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const foundBooking = bookings.find((b) => b.id === id);
    setBooking(foundBooking || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Booking not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`Booking for ${booking.location}`} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {booking.imageUrl ? (
          <Image
            source={{ uri: booking.imageUrl }}
            style={styles.image}
            defaultSource={require("@/assets/images/react-logo.png")}
            accessibilityLabel={`Image of ${booking.location}`}
          />
        ) : (
          <Image
            source={require("@/assets/images/react-logo.png")}
            style={styles.image}
            accessibilityLabel="Placeholder image"
          />
        )}
        <Text style={styles.title}>{booking.location}</Text>

        <View style={styles.row}>
          <Calendar size={18} color="#333" accessibilityLabel="Date" />
          <Text style={styles.text}>
            {format(booking.date, "MMM dd, yyyy")}
          </Text>
        </View>

        <View style={styles.row}>
          <Clock size={18} color="#333" accessibilityLabel="Time" />
          <Text style={styles.text}>{format(booking.date, "HH:mm")}</Text>
        </View>

        <View style={styles.row}>
          <DollarSign size={18} color="#333" accessibilityLabel="Price" />
          <Text style={styles.text}>
            {new Intl.NumberFormat("en-TZ", {
              style: "currency",
              currency: "TZS",
            }).format(booking.price)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.status}>Status: {booking.status}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  status: {
    fontSize: 16,
    color: "#666",
  },
});
