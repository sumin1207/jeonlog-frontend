import { useRouter } from "expo-router";
import { Button, View, Text } from "react-native";

export default function InterestPage() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        관심 있는 전시/연극을 선택해주세요
      </Text>
      {/* 관심 선택 UI는 추후 추가 */}
      <Button
        title='다음으로 넘어가기'
        onPress={() => router.replace("/(tabs)")}
      />
    </View>
  );
}
