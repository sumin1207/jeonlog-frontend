import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  getThemeColors,
} from "../theme";

export const createSkeletonStyles = (theme: string) => {
  const themeColors = getThemeColors(theme as "light" | "dark");

  return StyleSheet.create({
    // 기본 스켈레톤 스타일
    skeleton: {
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
    },

    // 전시 카드 스켈레톤
    exhibitionCard: {
      backgroundColor: themeColors.background,
      borderRadius: BorderRadius.card.medium,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...(theme === "dark" ? {} : { elevation: 2 }),
    },

    // 이미지 플레이스홀더
    imagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: BorderRadius.card.small,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
      marginRight: Spacing.md,
    },

    // 텍스트 스켈레톤
    textSkeleton: {
      height: Typography.fontSize.md,
      borderRadius: BorderRadius.xs,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
      marginBottom: Spacing.xs,
    },

    // 제목 스켈레톤
    titleSkeleton: {
      height: Typography.text.h3.fontSize,
      borderRadius: BorderRadius.xs,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
      marginBottom: Spacing.sm,
      width: "80%",
    },

    // 부제목 스켈레톤
    subtitleSkeleton: {
      height: Typography.text.body.fontSize,
      borderRadius: BorderRadius.xs,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
      marginBottom: Spacing.xs,
      width: "60%",
    },

    // 설명 스켈레톤
    descriptionSkeleton: {
      height: Typography.text.body.fontSize,
      borderRadius: BorderRadius.xs,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
      marginBottom: Spacing.xs,
      width: "100%",
    },

    // 작은 텍스트 스켈레톤
    smallTextSkeleton: {
      height: Typography.fontSize.sm,
      borderRadius: BorderRadius.xs,
      backgroundColor:
        theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
      marginBottom: Spacing.xs,
      width: "40%",
    },
  });
};
