import { StyleSheet, Dimensions } from "react-native";
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "../theme";

const { width: screenWidth } = Dimensions.get("window");

export const SearchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
    borderWidth: 0,
  },

  // 상단 바 스타일
  topBar: {
    backgroundColor: Colors.primary.main,
    paddingTop: 50,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
  },
  topBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appIcon: {
    width: 32,
    height: 32,
    marginRight: Spacing.sm,
  },
  appTitle: {
    fontSize: Typography.text.h3.fontSize,
    fontWeight: Typography.text.h3.fontWeight,
    color: Colors.text.inverse,
  },
  searchIconButton: {
    padding: Spacing.sm,
  },

  // 검색 입력 필드 스타일
  searchInputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.light,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.gray200,
    borderRadius: BorderRadius.input.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
  },
  searchInputIcon: {
    marginLeft: Spacing.sm,
  },
  // 인기 검색어 섹션 스타일
  popularSection: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
  },
  popularTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.text.h4.fontWeight,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  popularDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginBottom: Spacing.md,
  },
  popularGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  popularColumn: {
    width: "48%",
  },
  popularItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  popularNumber: {
    fontSize: Typography.text.body.fontSize,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginRight: Spacing.sm,
    minWidth: 20,
  },
  popularText: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.primary,
    flex: 1,
  },

  // 검색 결과 섹션 스타일
  loadingSection: {
    padding: Spacing.md,
    alignItems: "center",
  },
  loadingText: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.secondary,
  },
  errorSection: {
    padding: Spacing.md,
    alignItems: "center",
  },
  errorText: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.secondary,
  },
  resultsSection: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
  },
  resultsTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.text.h4.fontWeight,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  resultItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.input.small,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: Spacing.sm,
  },
  resultTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.text.h4.fontWeight,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  resultArtist: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontStyle: "italic",
  },
  resultDescription: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
  },
  resultLocation: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  resultDate: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },

  // 전시회 검색 결과 전용 스타일
  exhibitionCard: {
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.card.medium,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  exhibitionInfo: {
    flex: 1,
  },
  exhibitionDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  resultPrice: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  resultHours: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  exhibitionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  likeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },

  // 검색 기록 관련 스타일
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  clearHistoryText: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  historyText: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.primary,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.xs,
  },

  // 빈 검색 결과 스타일
  emptySection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.screenPadding,
  },
  emptyTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.text.h4.fontWeight,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.secondary,
    textAlign: "center",
  },

  // 빈 검색 기록 스타일
  emptyHistorySection: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  emptyHistoryText: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.secondary,
  },
});
