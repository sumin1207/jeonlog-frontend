import React from "react";
import { View, StyleSheet, ViewStyle, SafeAreaView } from "react-native";
import { Colors, Spacing } from "../theme";

export interface ContainerProps {
  children: React.ReactNode;
  variant?: "default" | "safe" | "scroll" | "full";
  padding?: "none" | "small" | "medium" | "large";
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  variant = "default",
  padding = "medium",
  backgroundColor,
  style,
}) => {
  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    backgroundColor && { backgroundColor },
    style,
  ];

  if (variant === "safe") {
    return <SafeAreaView style={containerStyle}>{children}</SafeAreaView>;
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },

  // Variants
  default: {
    backgroundColor: Colors.background.light,
  },
  safe: {
    backgroundColor: Colors.background.light,
  },
  scroll: {
    backgroundColor: Colors.background.light,
  },
  full: {
    backgroundColor: Colors.background.light,
  },

  // Padding
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Spacing.sm,
  },
  paddingMedium: {
    padding: Spacing.md,
  },
  paddingLarge: {
    padding: Spacing.lg,
  },
});
