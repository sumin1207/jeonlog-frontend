import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Container } from "../design-system/layouts/Container";
import { Text } from "../design-system/components/Text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link
          href='/'
          style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 16,
  },
  link: {
    marginTop: 16,
    paddingVertical: 16,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
