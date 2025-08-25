import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";

export const ExhibitionLogStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  searchHeader: {
    backgroundColor: Colors.background.light,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 60,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.gray200,
    borderRadius: BorderRadius.input.medium,
    paddingHorizontal: Spacing.sm,
    marginTop: -10,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text.primary,
  },
  clearButton: {
    marginLeft: Spacing.sm,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.text.h3.fontSize,
    fontWeight: Typography.text.h3.fontWeight,
    color: Colors.primary.main,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    fontSize: Typography.text.caption.fontSize,
    color: Colors.text.secondary,
    marginHorizontal: 5,
  },
  activeToggle: {
    fontWeight: Typography.text.body.fontWeight,
    color: Colors.text.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
  },
  columnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
  },
  rightColumn: {
    marginTop: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: Typography.text.h4.fontSize,
    color: Colors.text.secondary,
  },
});
