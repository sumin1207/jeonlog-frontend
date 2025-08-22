import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  getThemeColors,
} from "../theme";

export const createHomeStyles = (theme: string) => {
  const themeColors = getThemeColors(theme as "light" | "dark");

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      borderBottomColor: themeColors.border,
      borderBottomWidth: 1,
    },
    content: {
      flex: 1,
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.screenPadding,
      backgroundColor: themeColors.background,
    },
    title: {
      fontSize: Typography.text.h2.fontSize,
      fontWeight: Typography.text.h2.fontWeight,
      marginBottom: Spacing.sm,
      color: themeColors.text.primary,
      textAlign: "left",
      alignSelf: "flex-start",
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

    // 탭 스타일
    tabContainer: {
      flexDirection: "row",
      marginBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      backgroundColor: themeColors.background,
    },
    tab: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: "center",
    },
    tabText: {
      fontSize: Typography.text.body.fontSize,
      fontWeight: Typography.fontWeight.medium,
      color: themeColors.text.secondary,
    },
    activeTabText: {
      color: Colors.primary.main,
      fontWeight: Typography.fontWeight.semibold,
    },
    activeTabIndicator: {
      position: "absolute",
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: Colors.primary.main,
    },

    // 연령대 필터 스타일
    ageFilterContainer: {
      marginBottom: Spacing.md,
      paddingHorizontal: Spacing.screenPadding,
    },
    ageFilterScrollContainer: {
      paddingHorizontal: 0,
    },
    ageFilterButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.button.pill,
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.primary.main,
    },
    ageFilterButtonSelected: {
      backgroundColor: Colors.primary.main,
    },
    ageFilterButtonUnselected: {
      backgroundColor: "transparent",
    },
    ageFilterText: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
    },
    ageFilterTextSelected: {
      color: Colors.primary.contrast,
    },
    ageFilterTextUnselected: {
      color: Colors.primary.main,
    },

    // 추천 카드 스타일
    recommendationCard: {
      marginBottom: 0,
      elevation: 5,
      borderBottomColor: themeColors.border,
      borderBottomWidth: 1,
    },
    cardContent: {
      flexDirection: "row",
      padding: Spacing.md,
    },
    imagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: BorderRadius.card.small,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray200,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.md,
    },
    cardTextContainer: {
      flex: 1,
      justifyContent: "center",
    },
    cardTitle: {
      fontSize: Typography.text.body.fontSize,
      fontWeight: Typography.text.body.fontWeight,
      marginBottom: Spacing.xs,
    },
    cardLocation: {
      fontSize: Typography.fontSize.sm,
      marginBottom: 2,
    },
    cardDate: {
      fontSize: Typography.fontSize.xs,
    },
  });
};
