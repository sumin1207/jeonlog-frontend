import { StyleSheet, View, Text } from "react-native";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function ExhibitionLogScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    content: {
      flex: 1,
      paddingTop: 20, 
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
        <Text style={styles.title}>다른 사람들 전시 기록</Text>
        {/*전시 기록 관련 컴포넌트 추가 */}
      </View>
    </View>
  );
}
