import { StyleSheet } from "react-native";
import { Colors, Spacing, Typography, BorderRadius } from "../theme";

export const TopBarStyles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: Colors.primary.main,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing.md,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -30,
  },
  logoImage: {
    width: 200,
    height: 50,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchButtonContainer: {
    borderRadius: BorderRadius.button.pill,
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  searchButton: {
    padding: Spacing.sm,
  },
  title: {
    color: Colors.primary.contrast,
    fontSize: Typography.text.body.fontSize,
    fontWeight: Typography.fontWeight.medium,
  },
});
