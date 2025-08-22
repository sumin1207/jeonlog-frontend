import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "outlined" | "filled" | "underlined";
  size?: "small" | "medium" | "large";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = "outlined",
  size = "medium",
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeText = (text: string) => {
    setIsFilled(text.length > 0);
    props.onChangeText?.(text);
  };

  const inputContainerStyle = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
    containerStyle,
  ];

  const inputStyleCombined = [
    styles.input,
    styles[`${variant}Input`],
    styles[`${size}Input`],
    inputStyle,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={inputContainerStyle}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={inputStyleCombined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          placeholderTextColor={Colors.text.disabled}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {(error || helperText) && (
        <Text
          style={[styles.helperText, error && styles.errorText, errorStyle]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },

  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.input.medium,
    backgroundColor: Colors.background.card,
  },

  // Variants
  outlined: {
    borderColor: Colors.border.light,
  },
  filled: {
    backgroundColor: Colors.neutral.gray50,
    borderColor: "transparent",
  },
  underlined: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: Colors.border.light,
  },

  // Sizes
  small: {
    minHeight: 36,
  },
  medium: {
    minHeight: 44,
  },
  large: {
    minHeight: 52,
  },

  // States
  focused: {
    borderColor: Colors.border.focus,
  },
  error: {
    borderColor: Colors.status.error,
  },

  // Input styles
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.md,
  },

  outlinedInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  filledInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  underlinedInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  smallInput: {
    fontSize: Typography.fontSize.sm,
  },
  mediumInput: {
    fontSize: Typography.fontSize.md,
  },
  largeInput: {
    fontSize: Typography.fontSize.lg,
  },

  // Icons
  leftIcon: {
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.xs,
  },
  rightIcon: {
    paddingRight: Spacing.sm,
    paddingLeft: Spacing.xs,
  },

  // Helper text
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  errorText: {
    color: Colors.status.error,
  },
});
