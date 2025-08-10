// OAuth2 리디렉트 페이지
import { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OAuth2Redirect() {
  const router = useRouter();
  const { token } = useLocalSearchParams();

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        if (token) {
          console.log("🔐 OAuth2 리디렉트로 받은 JWT 토큰:", token);
          console.log("📝 토큰 길이:", (token as string).length);
          console.log(
            "🔍 토큰 형식 확인:",
            (token as string).substring(0, 20) + "..."
          );

          // JWT 토큰을 AsyncStorage에 저장
          await AsyncStorage.setItem("jwt_token", token as string);
          console.log("✅ JWT 토큰 AsyncStorage 저장 완료");

          // TODO: AuthContext에 로그인 상태 업데이트
          // TODO: 사용자 정보 저장

          // 잠시 대기 후 홈 화면으로 이동
          setTimeout(() => {
            router.replace("/(tabs)/home");
          }, 1000);
        } else {
          console.error("토큰이 없습니다");
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.error("OAuth2 리디렉트 처리 중 에러:", error);
        router.replace("/(tabs)/home");
      }
    };

    handleOAuth2Redirect();
  }, [token, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인 처리 중...</Text>
      <Text style={styles.subtitle}>잠시만 기다려주세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
