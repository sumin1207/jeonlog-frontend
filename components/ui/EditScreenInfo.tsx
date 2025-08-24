import React from "react";
import { StyleSheet, View } from "react-native";

import { ExternalLink } from "./ExternalLink";
import { Container } from "@/design-system/layouts/Container";
import { Text } from "@/design-system/components/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/design-system/theme/colors";

export default function EditScreenInfo({ path }: { path: string }) {
  const { theme } = useTheme();

  return (
    <Container>
      <Container style={styles.getStartedContainer}>
        <Text
          style={
            [
              styles.getStartedText,
              {
                color:
                  theme === "light"
                    ? "rgba(0,0,0,0.8)"
                    : "rgba(255,255,255,0.8)",
              },
            ] as any
          }>
          Open up the code for this screen:
        </Text>

        <Container
          style={
            [
              styles.codeHighlightContainer,
              styles.homeScreenFilename,
              {
                backgroundColor:
                  theme === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
              },
            ] as any
          }>
          <Text style={styles.monoText}>{path}</Text>
        </Container>

        <Text
          style={
            [
              styles.getStartedText,
              {
                color:
                  theme === "light"
                    ? "rgba(0,0,0,0.8)"
                    : "rgba(255,255,255,0.8)",
              },
            ] as any
          }>
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </Container>

      <Container style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href='https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'>
          <Text
            style={
              [styles.helpLinkText, { color: Colors.primary.main }] as any
            }>
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </ExternalLink>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  homeScreenFilename: {
    marginVertical: 8,
  },
  codeHighlightContainer: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  getStartedText: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  monoText: {
    fontFamily: "SpaceMono-Regular",
    fontSize: 14,
  },
  helpContainer: {
    marginTop: 16,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 16,
  },
  helpLinkText: {
    textAlign: "center",
    fontSize: 16,
  },
});
