import { Stack } from "expo-router";

const isLoggedin = false;
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Protected guard={isLoggedin}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedin}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="bookings/[id]" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
