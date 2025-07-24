import { useRouter } from "expo-router";
import { Button, View, Text } from "react-native";

export default function CategoryPage() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        추천 받고 싶은 카테고리를 선택해주세요
      </Text>
      {/* 카테고리 선택 UI는 추후 추가 */}
      <Button
        title='다음으로 넘어가기'
        onPress={() => router.replace("/onboarding/interest")}
      />
    </View>
  );
}
