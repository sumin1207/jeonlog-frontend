import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  getThemeColors,
} from "../theme";

export const createExhibitionStyles = (theme: string) => {
  const themeColors = getThemeColors(theme as "light" | "dark");

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.screenPadding,
      paddingVertical: Spacing.md,
    },
    backButton: {
      padding: Spacing.sm,
    },
    headerTitle: {
      fontSize: Typography.text.h4.fontSize,
      fontWeight: Typography.text.h4.fontWeight,
    },
    headerSpacer: {
      width: 40,
    },
    scrollView: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    imageContainer: {
      width: "100%",
      height: 400,
      backgroundColor: Colors.background.card,
      justifyContent: "center",
      alignItems: "center",
    },
    posterImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    content: {
      padding: Spacing.screenPadding,
    },

    titleSection: {
      marginBottom: Spacing.xxl,
      color: themeColors.text.primary,
      fontWeight: Typography.fontWeight.bold,
    },

    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.sm,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: Typography.text.h1.fontSize,
      fontWeight: Typography.text.h1.fontWeight,
      marginBottom: Spacing.sm,
      color: themeColors.text.primary,
    },
    subtitle: {
      fontSize: Typography.text.body.fontSize,
      marginBottom: Spacing.sm,
    },
    actionButtons: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      marginLeft: Spacing.md,
      padding: Spacing.sm,
    },
    categoryTag: {
      alignSelf: "flex-start",
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.button.medium,
    },
    categoryText: {
      color: Colors.primary.contrast,
      fontSize: Typography.fontSize.xs,
      fontWeight: Typography.fontWeight.semibold,
    },
    infoSection: {
      marginBottom: Spacing.xxl,
    },
    descriptionSection: {
      marginBottom: Spacing.xxl,
    },
    additionalSection: {
      marginBottom: Spacing.xxl,
    },
    sectionTitle: {
      fontSize: Typography.text.h4.fontSize,
      fontWeight: Typography.text.h4.fontWeight,
      marginBottom: Spacing.md,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: Spacing.md,
    },
    infoContent: {
      flex: 1,
      marginLeft: Spacing.sm,
    },
    infoLabel: {
      fontSize: Typography.fontSize.sm,
      marginBottom: Spacing.xs,
      color: themeColors.text.secondary,
    },
    infoValue: {
      fontSize: Typography.text.body.fontSize,
      fontWeight: Typography.fontWeight.medium,
    },
    infoAddress: {
      fontSize: Typography.fontSize.sm,
      marginTop: 2,
    },
    description: {
      fontSize: Typography.text.body.fontSize,
      lineHeight: Typography.text.body.fontSize * Typography.lineHeight.relaxed,
    },
    linkText: {
      textDecorationLine: "underline",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      fontSize: Typography.text.body.fontSize,
    },
    explanationImageContainer: {
      marginTop: Spacing.md,
      marginBottom: Spacing.md,
      alignItems: "center",
    },
    recordButton: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      backgroundColor: Colors.primary.main,
      borderRadius: BorderRadius.button.pill,
      marginTop: Spacing.sm,
    },
  });
};
