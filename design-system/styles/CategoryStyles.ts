import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";

export const CategoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
  },
  title: {
    fontSize: Typography.text.h2.fontSize,
    fontWeight: Typography.text.h2.fontWeight,
    color: Colors.primary.main,
    marginTop: 45,
    marginBottom: 6,
  },
  // 탭 스타일
  tabContainer: {
    flexDirection: "row",
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  tabText: {
    fontSize: Typography.text.body.fontSize,
    fontWeight: Typography.text.body.fontWeight,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary.main,
    fontWeight: Typography.text.h4.fontWeight,
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary.main,
  },
  // 카테고리 버튼 스타일
  categoryButton: {
    paddingVertical: Spacing.screenPadding,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.card.medium,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minHeight: 60,
    justifyContent: "center",
  },
  categoryText: {
    fontSize: Typography.text.body.fontSize,
    fontWeight: Typography.text.body.fontWeight,
    color: Colors.primary.main,
    textAlign: "center",
  },
});
