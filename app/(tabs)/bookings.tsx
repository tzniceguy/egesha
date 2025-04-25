import { Dimensions, Text, View, StyleSheet } from "react-native";
import Header from "@/components/header";
import { bookings } from "@/lib/mockups/bookings";
import BookingCard from "@/components/booking-card";
import { FlashList } from "@shopify/flash-list";

const Page = () => {
  return (
    <View style={styles.container}>
      <Header title="Bookings" />
      <View style={styles.content}>
        <FlashList
          data={bookings}
          renderItem={({ item }) => (
            <BookingCard
              title={item.title}
              date={item.date}
              price={item.price}
            />
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
