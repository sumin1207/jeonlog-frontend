import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "../theme";

export const BookmarkedStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.text.h4.fontWeight,
    color: Colors.text.primary,
  },
  listContentContainer: {
    padding: Spacing.screenPadding,
  },
  exhibitionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.card.medium,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.card,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  exhibitionImage: {
    width: 90,
    height: 120,
    borderRadius: BorderRadius.card.small,
    marginRight: Spacing.md,
  },
  exhibitionInfo: {
    flex: 1,
    height: 110,
    justifyContent: "space-between",
  },
  exhibitionTitle: {
    fontSize: Typography.text.body.fontSize,
    fontWeight: Typography.text.body.fontWeight,
    color: Colors.text.primary,
  },
  exhibitionLocation: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
  },
  exhibitionDate: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: Typography.text.body.fontSize,
    textAlign: "center",
    color: Colors.text.secondary,
  },
});
