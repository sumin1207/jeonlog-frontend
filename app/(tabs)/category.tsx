import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function CategoryScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    text: {
      color: theme === "dark" ? "#fff" : "#1c3519",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>카테고리 화면</Text>
    </View>
  );
}
