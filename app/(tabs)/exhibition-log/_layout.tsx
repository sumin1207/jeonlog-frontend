import { Stack } from 'expo-router';

export default function ExhibitionLogStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="exhibitionLog" options={{ headerShown: false }} />
      <Stack.Screen name="[exhibitionLog-id]" options={{ headerShown: false }} />
    </Stack>
  );
}