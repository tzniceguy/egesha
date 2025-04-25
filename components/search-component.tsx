import React, { useEffect } from "react";
import colors from "@/lib/styles/colors";
import { Calendar, Search } from "lucide-react-native";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

interface SearchModalProps {
  // Replace onHeightChange with onStateChange
  onStateChange?: (isExpanded: boolean) => void;
}

// Define map region type (can be shared or defined in Page)
type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COLLAPSED_HEIGHT = 200;
const EXPANDED_HEIGHT = 400;

const SearchModal = ({ onStateChange }: SearchModalProps) => {
  const height = useSharedValue(COLLAPSED_HEIGHT);
  const isExpanded = useSharedValue(false);

  // Helper function to call the state change callback on the JS thread
  const notifyStateChange = (expanded: boolean) => {
    "worklet"; // Mark as a worklet if needed, but runOnJS handles the transition
    if (onStateChange) {
      runOnJS(onStateChange)(expanded);
    }
  };

  const tapGesture = Gesture.Tap().onEnd(() => {
    "worklet"; // Mark gesture callbacks as worklets
    const nextState = !isExpanded.value;
    isExpanded.value = nextState;
    height.value = withTiming(nextState ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT, {
      duration: 300,
    });
    // Notify parent component about the state change
    notifyStateChange(nextState);
  });

  // Removed useEffect related to onHeightChange

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.modal, animatedStyle]}>
        <View style={styles.handleBarContainer}>
          <View style={styles.handleBar} />
        </View>
        <Text style={styles.title}>Find a parking</Text>
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <Search size={20} color="#888" style={styles.searchIcon} />
            <TextInput placeholder="where to?" style={styles.input} />
          </View>
          <TouchableOpacity style={styles.button}>
            <Calendar size={24} color={colors.primary} />
            <Text style={styles.buttonText}>schedule</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

// --- Styles remain the same ---
const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10, // Ensure modal is visually above map controls if needed
  },
  handleBarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 15, // Adjust padding as needed
    fontSize: 16, // Ensure text is readable
  },
  button: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    gap: 6,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SearchModal;
