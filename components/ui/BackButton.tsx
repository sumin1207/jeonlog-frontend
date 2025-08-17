import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BackButtonProps {
  style?: ViewStyle;
  color?: string;
  size?: number;
}

export default function BackButton({ style, color = '#000000', size = 28 }: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1.0 }, style]}
    >
      <Ionicons name="arrow-back" size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
  },
});
