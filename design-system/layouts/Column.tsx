import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Spacing } from "../theme";

export interface ColumnProps {
  children: React.ReactNode;
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  style?: ViewStyle;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  align = "stretch",
  justify = "flex-start",
  gap = "none",
  style,
}) => {
  const columnStyle = [
    styles.base,
    styles[align],
    styles[justify],
    styles[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`],
    style,
  ];

  return <View style={columnStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "column",
  },

  // Alignment
  "flex-start": {
    alignItems: "flex-start",
  },
  center: {
    alignItems: "center",
  },
  "flex-end": {
    alignItems: "flex-end",
  },
  stretch: {
    alignItems: "stretch",
  },

  // Justification
  "flex-start": {
    justifyContent: "flex-start",
  },
  center: {
    justifyContent: "center",
  },
  "flex-end": {
    justifyContent: "flex-end",
  },
  "space-between": {
    justifyContent: "space-between",
  },
  "space-around": {
    justifyContent: "space-around",
  },
  "space-evenly": {
    justifyContent: "space-evenly",
  },

  // Gaps
  gapNone: {
    gap: 0,
  },
  gapXs: {
    gap: Spacing.xs,
  },
  gapSm: {
    gap: Spacing.sm,
  },
  gapMd: {
    gap: Spacing.md,
  },
  gapLg: {
    gap: Spacing.lg,
  },
  gapXl: {
    gap: Spacing.xl,
  },
});
