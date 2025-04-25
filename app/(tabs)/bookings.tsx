import React, { useState, useCallback } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import Header from "@/components/header";
import { bookings as mockBookings } from "@/lib/mockups/bookings";
import BookingCard from "@/components/booking-card";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";

const Page = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState(mockBookings);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate data refresh
    setTimeout(() => {
      // Here you can refetch from server or update bookings
      setBookings([...mockBookings]); // example: reset to mock data
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Bookings" />
      <View style={styles.content}>
        <FlashList
          data={bookings}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onPress={() => router.push(`/bookings/${item.id}`)}
            />
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    padding: 16,
  },
});

export default Page;
