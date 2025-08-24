import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";

import EditScreenInfo from "@/components/ui/EditScreenInfo";
import { Container } from "@/design-system/layouts/Container";
import { Text } from "@/design-system/components/Text";
import { useTheme } from "@/contexts/ThemeContext";

export default function ModalScreen() {
  const { theme } = useTheme();

  return (
    <Container style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View
        style={[
          styles.separator,
          {
            backgroundColor:
              theme === "light" ? "#eee" : "rgba(255,255,255,0.1)",
          },
        ]}
      />
      <EditScreenInfo path='app/modal.tsx' />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
