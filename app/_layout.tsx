import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/stores/auth";
import { useVehicleStore } from "@/stores/vehicle";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isAuthenticated, initialize } = useAuthStore();
  const { fetchVehicles } = useVehicleStore();

  useEffect(() => {
    initialize();
    if (isAuthenticated) {
      fetchVehicles();
    }
  }, [initialize, isAuthenticated, fetchVehicles]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="bookings/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="vehicles" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
