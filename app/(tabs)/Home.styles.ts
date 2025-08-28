import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  getThemeColors,
} from "../../design-system/theme";

export const style = (theme: string) => {
  const themeColors = getThemeColors(theme as "light" | "dark");

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    content: {
      flex: 1,
      paddingTop: Spacing.lg,
      paddingHorizontal: Spacing.screenPadding,
      backgroundColor: themeColors.background,
    },
    title1: {
      fontSize: Typography.text.h3.fontSize,
      fontWeight: Typography.fontWeight.bold,
      marginBottom: Spacing.lg,
      marginTop: Spacing.xl,
      color: themeColors.text.primary,
      textAlign: "left",
      alignSelf: "flex-start",
      letterSpacing: -0.5,
      paddingHorizontal: Spacing.md,
    },

    title2: {
      fontSize: Typography.text.h3.fontSize,
      fontWeight: Typography.fontWeight.bold,
      marginBottom: Spacing.lg,
      marginTop: Spacing.xl,
      color: themeColors.text.primary,
      textAlign: "center",
      letterSpacing: -0.5,
    },

    skeletonContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    skeletonItem: {
      width: "48%",
      marginBottom: Spacing.md,
    },

    tabContainer: {
      flexDirection: "row",
      marginBottom: Spacing.lg,
      backgroundColor: "transparent",
      borderRadius: BorderRadius.button.pill,
      padding: 0,
      marginHorizontal: 0,
      marginLeft: 0,
      borderBottomWidth: 1,
      borderBottomColor:
        theme === "dark" ? Colors.neutral.gray600 : Colors.neutral.gray300,
    },
    tab: {
      flex: 1,
      paddingVertical: Spacing.md,
      alignItems: "center",
      borderRadius: 0,
      marginHorizontal: 0,
      position: "relative",
    },
    tabText: {
      fontSize: Typography.text.body.fontSize,
      fontWeight: Typography.fontWeight.medium,
      color: themeColors.text.secondary,
      letterSpacing: -0.2,
      zIndex: 2,
    },
    activeTabText: {
      color: Colors.primary.main,
      fontWeight: Typography.fontWeight.semibold,
      zIndex: 2,
    },
    activeTabIndicator: {
      position: "absolute",
      bottom: -1,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: Colors.primary.main,
      borderRadius: 0,
      shadowColor: Colors.primary.main,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      zIndex: 1,
    },

    ageFilterContainer: {
      marginBottom: Spacing.lg,
      paddingHorizontal: 0,
    },
    ageFilterScrollContainer: {
      paddingHorizontal: 0,
    },
    ageFilterButton: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.button.pill,
      marginRight: Spacing.md,
      borderWidth: 1.5,
      borderColor:
        theme === "dark" ? Colors.neutral.gray600 : Colors.neutral.gray300,
      shadowColor: Colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    ageFilterButtonSelected: {
      backgroundColor: Colors.primary.main,
      borderColor: Colors.primary.main,
      shadowColor: Colors.primary.main,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    ageFilterButtonUnselected: {
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.white,
    },
    ageFilterText: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      letterSpacing: -0.1,
    },
    ageFilterTextSelected: {
      color: Colors.primary.contrast,
    },
    ageFilterTextUnselected: {
      color: themeColors.text.secondary,
    },

    recommendationCard: {
      marginBottom: Spacing.lg,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.white,
      borderRadius: BorderRadius.card.medium,
      shadowColor: Colors.shadow.light,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor:
        theme === "dark" ? Colors.neutral.gray700 : Colors.neutral.gray100,
      overflow: "hidden",
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "stretch",
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray700 : Colors.neutral.gray100,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: Colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardTextContainer: {
      flex: 1,
      justifyContent: "center",
      padding: Spacing.lg,
    },
    cardTitle: {
      fontSize: Typography.text.body.fontSize,
      fontWeight: Typography.fontWeight.bold,
      marginBottom: Spacing.sm,
      letterSpacing: -0.2,
      lineHeight: Typography.text.body.fontSize * 1.3,
      color: themeColors.text.primary,
    },
    cardLocation: {
      fontSize: Typography.fontSize.sm,
      marginBottom: Spacing.xs,
      color: themeColors.text.secondary,
      letterSpacing: -0.1,
    },
    cardDate: {
      fontSize: Typography.fontSize.sm,
      color: themeColors.text.secondary,
      fontWeight: Typography.fontWeight.medium,
      letterSpacing: -0.1,
    },
  });
};
