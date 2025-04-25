import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useMemo } from "react";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  textColor?: string;
  headerHeight?: number;
  customLeftComponent?: React.ReactNode;
  customRightComponent?: React.ReactNode;
  onBackPress?: () => void;
  titleStyle?: TextStyle;
  headerStyle?: ViewStyle;
  backIconColor?: string;
  elevation?: number;
  safeAreaBackground?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Header",
  showBackButton = false,
  backgroundColor = "transparent",
  textColor = "#171a1f",
  headerHeight = 56,
  customLeftComponent,
  customRightComponent,
  onBackPress,
  titleStyle,
  headerStyle,
  backIconColor = "#171a1f",
  elevation = 4,
  safeAreaBackground,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          backgroundColor: safeAreaBackground || backgroundColor,
        },
        header: {
          backgroundColor,
          height: headerHeight,
        },
        headerText: {
          color: textColor,
        },
      }),
    [backgroundColor, headerHeight, textColor, safeAreaBackground],
  );

  return (
    <>
      <StatusBar
        barStyle={
          isDarkColor(backgroundColor) ? "light-content" : "dark-content"
        }
        backgroundColor={backgroundColor}
        translucent={backgroundColor === "transparent"}
      />
      <SafeAreaView style={[styles.safeArea, dynamicStyles.safeArea]}>
        <View
          style={[
            styles.header,
            dynamicStyles.header,
            { elevation: Platform.OS === "android" ? elevation : 0 },
            headerStyle,
          ]}
        >
          {customLeftComponent ||
            (showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ArrowLeft size={24} color={backIconColor} />
              </TouchableOpacity>
            ))}
          <Text
            style={[styles.headerText, dynamicStyles.headerText, titleStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityRole="header"
            accessibilityLabel={title}
          >
            {title}
          </Text>
          {customRightComponent && (
            <View style={styles.rightComponent}>{customRightComponent}</View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 0 : 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
    // Removed border and shadow for cleaner transparent look
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  rightComponent: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
});

// Utility function to determine if a color is dark
const isDarkColor = (color: string): boolean => {
  if (color === "transparent") return false; // Treat transparent as light
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

export default Header;
