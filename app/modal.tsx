import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";

import EditScreenInfo from "@/components/ui/EditScreenInfo";
import { Text } from "@/design-system/components";
import { Colors, Spacing, Typography } from "@/design-system/theme";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text
        variant='h3'
        style={styles.title}>
        Modal
      </Text>
      <View style={styles.separator} />
      <EditScreenInfo path='app/modal.tsx' />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
  },
  separator: {
    marginVertical: Spacing.xl,
    height: 1,
    width: "80%",
    backgroundColor: Colors.border.light,
  },
});
