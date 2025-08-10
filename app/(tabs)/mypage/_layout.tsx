import { Stack } from "expo-router";

export default function MyPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="exhibition/Bookmarked" />
      <Stack.Screen name="exhibition/thumbs-up" />
      <Stack.Screen name="exhibition/visited" />
    </Stack>
  );
}
