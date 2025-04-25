import { Tabs } from "expo-router";
import { Home, Calendar, User2 } from "lucide-react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 72,
          left: 10,
          right: 10,
          padding: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "account",
          tabBarIcon: ({ color }) => <User2 size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
