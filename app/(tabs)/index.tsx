import { StyleSheet, View, Text } from "react-native";
import HorizontalSliding from "@/components/HorizontalSliding";
import { useTheme } from "../../contexts/ThemeContext";

export default function IndexHome() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    title: {
      fontSize: 22,
      fontWeight: "condensed",
      marginBottom: 10,
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>요즘 뜨고 있는 전시</Text>
      <HorizontalSliding />
    </View>
  );
}
