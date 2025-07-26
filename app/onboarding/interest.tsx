import { useRouter } from "expo-router";
import { Button, View, Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function InterestPage() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
      }}>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 20,
          color: theme === "dark" ? "#fff" : "#1c3519",
        }}>
        관심 있는 전시/연극을 선택해주세요
      </Text>
      {/* 관심 선택 UI는 추후 추가 */}
      <Button
        title='다음으로 넘어가기'
        onPress={() => router.replace("/(tabs)/home")}
      />
    </View>
  );
}
