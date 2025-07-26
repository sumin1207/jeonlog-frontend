import { useRouter } from "expo-router";
import { Button, View, Text, StyleSheet } from "react-native";
import TopBar from "@/components/TopBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function InterestPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
  });

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.title}>관심 있는 전시/연극을 선택해주세요</Text>
        {/* 관심 선택 UI는 추후 추가 */}
        <Button
          title='다음으로 넘어가기'
          onPress={() => router.replace("/(tabs)/home")}
        />
      </View>
    </View>
  );
}
