import React, { useEffect, useRef, useState } from "react";
import colors from "@/lib/styles/colors";
import { Search, X } from "lucide-react-native";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

interface SearchModalProps {
  onStateChange?: (isExpanded: boolean) => void;
  onSearch: (query: string) => void;
  searchResults?: ParkingSearchResults[];
  onResultPress?: (result: {
    id: string;
    latitude: number;
    longitude: number;
  }) => void;
  searchValue?: string;
  placeholder?: string;
  isSearching?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COLLAPSED_HEIGHT = 200;
const EXPANDED_HEIGHT = 400;

const SearchModal = ({
  onStateChange,
  onSearch,
  searchResults = [],
  onResultPress,
  searchValue = "",
  placeholder = "where to?",
  isSearching = false,
}: SearchModalProps) => {
  const height = useSharedValue(COLLAPSED_HEIGHT);
  const isExpanded = useSharedValue(false);
  const inputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState(searchValue);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (!isExpanded.value) {
          expandModal();
        }
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {},
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const notifyStateChange = (expanded: boolean) => {
    "worklet";
    if (onStateChange) {
      runOnJS(onStateChange)(expanded);
    }
  };

  const expandModal = () => {
    "worklet";
    isExpanded.value = true;
    height.value = withTiming(EXPANDED_HEIGHT, { duration: 300 });
    notifyStateChange(true);
  };

  const collapseModal = () => {
    "worklet";
    isExpanded.value = false;
    height.value = withTiming(COLLAPSED_HEIGHT, { duration: 300 });
    notifyStateChange(false);
    runOnJS(Keyboard.dismiss)();
  };

  const toggleModal = () => {
    "worklet";
    if (isExpanded.value) {
      collapseModal();
    } else {
      expandModal();
    }
  };

  const handleTapGesture = Gesture.Tap().onEnd(() => {
    toggleModal();
  });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      "worklet";
      const newHeight = height.value - event.translationY;
      if (newHeight >= COLLAPSED_HEIGHT && newHeight <= EXPANDED_HEIGHT) {
        height.value = newHeight;
      }
    })
    .onEnd((event) => {
      "worklet";
      const velocity = event.velocityY;
      const currentHeight = height.value;
      const midPoint = (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2;

      if (velocity > 500) {
        collapseModal();
      } else if (velocity < -500) {
        expandModal();
      } else if (currentHeight > midPoint) {
        expandModal();
      } else {
        collapseModal();
      }
    });

  const combinedGesture = Gesture.Race(handleTapGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const closeButtonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = isExpanded.value ? 1 : 0;
    const display = isExpanded.value ? "flex" : "none";

    return {
      opacity: withTiming(opacity, { duration: 200 }),
      display,
    };
  });

  const handleInputFocus = () => {
    "worklet";
    if (!isExpanded.value) {
      expandModal();
    }
  };

  const clearSearch = () => {
    setSearchText("");
    handleSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <Animated.View style={[styles.modal, animatedStyle]}>
        <GestureDetector gesture={combinedGesture}>
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>
        </GestureDetector>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Find a parking</Text>
            <Animated.View style={closeButtonAnimatedStyle}>
              <TouchableOpacity
                onPress={collapseModal}
                style={styles.closeButton}
              >
                <X size={24} color="#888" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <Search size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                ref={inputRef}
                placeholder={placeholder}
                style={styles.input}
                value={searchText}
                onChangeText={handleSearchChange}
                onFocus={() => runOnJS(handleInputFocus)()}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={styles.clearButton}
                >
                  <X size={16} color="#888" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Animated.View style={[styles.expandedContent]}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Text>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View style={styles.resultsContainer}>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    style={styles.resultItem}
                    onPress={() => onResultPress?.(result)}
                  >
                    <Text style={styles.resultTitle}>{result.name}</Text>
                    {result.address && (
                      <Text style={styles.resultAddress}>{result.address}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : searchText.length > 2 ? (
              <View style={styles.noResults}>
                <Text>No results found</Text>
              </View>
            ) : null}
          </Animated.View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  handleBarContainer: {
    alignItems: "center",
    paddingVertical: 15,
    cursor: "pointer",
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    minHeight: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  button: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 6,
    minHeight: 50,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  expandedContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  resultAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default SearchModal;
