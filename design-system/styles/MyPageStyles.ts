import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";

export const MyPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerTitle: {
    fontSize: Typography.text.h3.fontSize,
    fontWeight: Typography.text.h3.fontWeight,
    color: Colors.text.primary,
  },
  headerIcons: {
    flexDirection: "row",
  },
  topButton: {
    marginLeft: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.avatar.large,
    backgroundColor: Colors.neutral.gray200,
    marginRight: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.text.bodySmall.fontSize,
    fontWeight: Typography.text.bodySmall.fontWeight,
    color: Colors.text.primary,
  },
  profileBio: {
    fontSize: Typography.text.caption.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  buttonsSection: {
    flexDirection: "row",
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
    alignItems: "center",
  },
  mainButtonsWrapper: {
    flex: 1,
    flexDirection: "row",
    marginRight: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: BorderRadius.button.medium,
    paddingVertical: 6,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: Typography.text.bodySmall.fontSize,
    fontWeight: Typography.text.bodySmall.fontWeight,
    color: Colors.text.primary,
  },
  iconButton: {
    backgroundColor: Colors.neutral.gray200,
    borderRadius: BorderRadius.button.medium,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
  },
  divider: {
    height: Spacing.sm,
    backgroundColor: Colors.neutral.gray100,
  },
  logsSection: {
    padding: Spacing.screenPadding,
    paddingTop: Spacing.md,
  },
  logsTitle: {
    fontSize: Typography.text.bodySmall.fontSize,
    fontWeight: Typography.text.bodySmall.fontWeight,
    marginBottom: Spacing.md,
    color: Colors.text.primary,
  },
  recordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  logCard: {
    width: "48%",
    marginBottom: Spacing.screenPadding,
  },
  logImage: {
    width: "100%",
    height: 220,
    borderRadius: BorderRadius.card.medium,
  },
  logTitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.text.caption.fontSize,
    color: Colors.text.primary,
    textAlign: "center",
  },
  emptyRecords: {
    width: "100%",
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.secondary,
  },
  loginRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.screenPadding,
  },
  loginRequiredTitle: {
    fontSize: Typography.text.h2.fontSize,
    fontWeight: Typography.text.h2.fontWeight,
    marginTop: Spacing.screenPadding,
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
  },
  loginRequiredSubtitle: {
    fontSize: Typography.text.body.fontSize,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  loginButton: {
    backgroundColor: Colors.status.info,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.button.medium,
  },
  loginButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.text.body.fontSize,
    fontWeight: Typography.text.body.fontWeight,
  },
  visitedSection: {
    padding: Spacing.screenPadding,
    paddingTop: Spacing.md,
  },
});
