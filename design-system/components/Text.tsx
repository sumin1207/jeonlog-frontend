import React from "react";
import {
  Text as RNText,
  StyleSheet,
  TextStyle,
  TextProps as RNTextProps,
} from "react-native";
import { Colors, Typography } from "../theme";

export interface TextProps extends RNTextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodySmall"
    | "caption"
    | "button";
  color?:
    | "primary"
    | "secondary"
    | "disabled"
    | "inverse"
    | "success"
    | "warning"
    | "error";
  align?: "left" | "center" | "right";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
  variant = "body",
  color = "primary",
  align = "left",
  weight,
  style,
  children,
  ...props
}) => {
  const textStyle = [
    styles.base,
    styles[variant],
    styles[color],
    styles[align],
    weight && styles[weight],
    style,
  ];

  return (
    <RNText
      style={textStyle}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: Colors.text.primary,
  },

  // Variants
  h1: {
    fontSize: Typography.text.h1.fontSize,
    fontWeight: Typography.text.h1.fontWeight,
    lineHeight: Typography.text.h1.fontSize * Typography.text.h1.lineHeight,
  },
  h2: {
    fontSize: Typography.text.h2.fontSize,
    fontWeight: Typography.text.h2.fontWeight,
    lineHeight: Typography.text.h2.fontSize * Typography.text.h2.lineHeight,
  },
  h3: {
    fontSize: Typography.text.h3.fontSize,
    fontWeight: Typography.text.h3.fontWeight,
    lineHeight: Typography.text.h3.fontSize * Typography.text.h3.lineHeight,
  },
  h4: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.text.h4.fontWeight,
    lineHeight: Typography.text.h4.fontSize * Typography.text.h4.lineHeight,
  },
  body: {
    fontSize: Typography.text.body.fontSize,
    fontWeight: Typography.text.body.fontWeight,
    lineHeight: Typography.text.body.fontSize * Typography.text.body.lineHeight,
  },
  bodySmall: {
    fontSize: Typography.text.bodySmall.fontSize,
    fontWeight: Typography.text.bodySmall.fontWeight,
    lineHeight:
      Typography.text.bodySmall.fontSize * Typography.text.bodySmall.lineHeight,
  },
  caption: {
    fontSize: Typography.text.caption.fontSize,
    fontWeight: Typography.text.caption.fontWeight,
    lineHeight:
      Typography.text.caption.fontSize * Typography.text.caption.lineHeight,
  },
  button: {
    fontSize: Typography.text.button.fontSize,
    fontWeight: Typography.text.button.fontWeight,
    lineHeight:
      Typography.text.button.fontSize * Typography.text.button.lineHeight,
  },

  // Colors
  primary: {
    color: Colors.text.primary,
  },
  secondary: {
    color: Colors.text.secondary,
  },
  disabled: {
    color: Colors.text.disabled,
  },
  inverse: {
    color: Colors.text.inverse,
  },
  success: {
    color: Colors.status.success,
  },
  warning: {
    color: Colors.status.warning,
  },
  error: {
    color: Colors.status.error,
  },

  // Alignment
  left: {
    textAlign: "left",
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  },

  // Weights
  light: {
    fontWeight: Typography.fontWeight.light,
  },
  normal: {
    fontWeight: Typography.fontWeight.normal,
  },
  medium: {
    fontWeight: Typography.fontWeight.medium,
  },
  semibold: {
    fontWeight: Typography.fontWeight.semibold,
  },
  bold: {
    fontWeight: Typography.fontWeight.bold,
  },
  extrabold: {
    fontWeight: Typography.fontWeight.extrabold,
  },
});
