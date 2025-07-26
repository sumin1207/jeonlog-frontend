import React from "react";
import { StyleSheet, View, Text } from "react-native";
import HorizontalSliding from "@/components/HorizontalSliding";
import TopBar from "@/components/TopBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function HomeScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    content: {
      flex: 1,
      paddingTop: 20, // 상단 바와의 간격
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "condensed",
      marginBottom: 20,
      color: theme === "dark" ? "#fff" : "#1c3519",
      textAlign: "left",
      alignSelf: "flex-start",
    },
  });

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.title}>요즘 뜨고 있는 전시</Text>
        <HorizontalSliding />
      </View>
    </View>
  );
}
