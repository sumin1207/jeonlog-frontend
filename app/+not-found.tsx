import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Text } from "@/design-system/components";
import { Colors, Spacing, Typography } from "@/design-system/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text
          variant='h3'
          style={styles.title}>
          This screen doesn't exist.
        </Text>

        <Link
          href='/'
          style={styles.link}>
          <Text
            variant='body'
            style={styles.linkText}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  title: {
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  link: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },
  linkText: {
    color: Colors.status.info,
  },
});
