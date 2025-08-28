import { StyleSheet } from "react-native";
import { Colors, Spacing, Typography } from "../theme";

export const SettingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.screenPadding,
  },
  sectionTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.text.h4.fontWeight,
    color: Colors.primary.main,
    marginHorizontal: Spacing.screenPadding,
    marginVertical: Spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background.card,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.primary.main,
  },
  menuItemSubtitle: {
    fontSize: Typography.text.bodySmall.fontSize,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});
