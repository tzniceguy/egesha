import {
  Text,
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { z } from "zod";
import User from "@/utils/validators/user";

// Mock user data for demonstration purposes
const mockUser: z.infer<typeof User> & { avatar: string } = {
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+1 (555) 123-4567",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Placeholder avatar
};

type ProfileMenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  onPress: () => void;
};

// Menu item component
const ProfileMenuItem = ({ icon, name, onPress }: ProfileMenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.6}
  >
    <View style={styles.menuItemContent}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color="#667eea" />
      </View>
      <Text style={styles.menuItemText}>{name}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={22} color="#999" />
  </TouchableOpacity>
);

const Page = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: () => {
          // Perform logout logic here (e.g., clear auth tokens)
          // Navigate to the login screen
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  const menuItems = [
    {
      icon: "person-outline",
      name: "Edit Profile",
      onPress: () => router.push("/profile/edit"), // Example route
    },
    {
      icon: "card-outline",
      name: "Payment Methods",
      onPress: () => router.push("/profile/payment"), // Example route
    },
    {
      icon: "receipt-outline",
      name: "My Bookings",
      onPress: () => router.push("/profile/bookings"), // Example route
    },
    {
      icon: "settings-outline",
      name: "Settings",
      onPress: () => router.push("/profile/settings"), // Example route
    },
    {
      icon: "help-circle-outline",
      name: "Help & Support",
      onPress: () => router.push("/support"), // Example route
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>
            {mockUser.firstName} {mockUser.lastName}
          </Text>
          <Text style={styles.userPhone}>{mockUser.phoneNumber}</Text>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <ProfileMenuItem
              key={index}
              icon={item.icon}
              name={item.name}
              onPress={item.onPress}
            />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#ff4757" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#667eea",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userPhone: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e9eafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 40,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#ff4757",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Page;
