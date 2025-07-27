import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function SearchScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: theme === "dark" ? "#fff" : "#1c3519",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <TopBar title='검색' />
      <View style={styles.content}>
        <Text style={styles.text}>검색 화면</Text>
      </View>
    </View>
  );
}
