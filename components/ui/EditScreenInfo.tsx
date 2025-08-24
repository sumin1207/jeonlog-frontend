import React from "react";
import { StyleSheet, View } from "react-native";

import { ExternalLink } from "./ExternalLink";
import { Text } from "@/design-system/components";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "@/design-system/theme";

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          color='secondary'>
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
          <Text
            variant='body'
            style={styles.monoText}>
            {path}
          </Text>
        </View>

        <Text
          style={styles.getStartedText}
          color='secondary'>
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href='https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'>
          <Text
            style={styles.helpLinkText}
            color='primary'>
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: Spacing.xxl,
  },
  homeScreenFilename: {
    marginVertical: Spacing.sm,
  },
  codeHighlightContainer: {
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.neutral.gray100,
  },
  getStartedText: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
    textAlign: "center",
  },
  monoText: {
    fontFamily: "SpaceMono",
  },
  helpContainer: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: Spacing.md,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
