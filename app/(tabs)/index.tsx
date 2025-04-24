import MapComponent from "@/components/map-component";
import SearchModal from "@/components/search-component";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";

const Page = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <MapComponent />
      <SearchModal />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;
