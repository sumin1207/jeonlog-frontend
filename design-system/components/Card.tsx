import React from "react";
import { View, StyleSheet, ViewStyle, Pressable } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "../theme";

export interface CardProps {
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  style?: ViewStyle;
  padding?: "none" | "small" | "medium" | "large";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "elevated",
  size = "medium",
  onPress,
  style,
  padding = "medium",
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[size],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.9}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card.medium,
  },

  // Variants
  elevated: {
    ...Shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filled: {
    backgroundColor: Colors.neutral.gray50,
  },

  // Sizes
  small: {
    borderRadius: BorderRadius.card.small,
  },
  medium: {
    borderRadius: BorderRadius.card.medium,
  },
  large: {
    borderRadius: BorderRadius.card.large,
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
