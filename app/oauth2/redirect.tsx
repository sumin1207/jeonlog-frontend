// OAuth2 리디렉트 페이지
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/context/AuthContext";
import {
  isTokenValid,
  extractUserInfoFromToken,
} from "../../services/authService";

export default function OAuth2Redirect() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("로그인 처리 중...");

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

          // JWT 토큰 유효성 검증
          if (!isTokenValid(token as string)) {
            console.error("❌ JWT 토큰이 유효하지 않습니다");
            setStatus("error");
            setMessage("유효하지 않은 토큰입니다. 다시 로그인해주세요.");
            setTimeout(() => {
              router.replace("/(tabs)/home");
            }, 2000);
            return;
          }

          // 토큰에서 사용자 정보 추출
          const userInfoFromToken = extractUserInfoFromToken(token as string);
          console.log("👤 토큰에서 추출한 사용자 정보:", userInfoFromToken);

          // JWT 토큰을 AsyncStorage에 저장
          await AsyncStorage.setItem("jwt_token", token as string);
          console.log("✅ JWT 토큰 AsyncStorage 저장 완료");

          // 저장된 토큰 확인
          const savedToken = await AsyncStorage.getItem("jwt_token");
          console.log("🔍 저장된 토큰 확인:", savedToken ? "성공" : "실패");
          if (savedToken) {
            console.log("🔍 저장된 토큰 길이:", savedToken.length);
            console.log(
              "🔍 저장된 토큰 일부:",
              savedToken.substring(0, 50) + "..."
            );
          }

          // 추출한 사용자 정보로 AuthContext 업데이트
          const userInfo = {
            id: userInfoFromToken?.sub || "temp_id",
            name: userInfoFromToken?.email?.split("@")[0] || "사용자",
            email: userInfoFromToken?.email || "user@example.com",
            loginType: "google" as const,
            accessToken: token as string,
          };

          // AuthContext에 로그인 상태 업데이트
          login(userInfo);
          console.log("✅ AuthContext 로그인 상태 업데이트 완료");
          console.log("🔍 AuthContext 상태 확인 - userInfo:", userInfo);

          // 잠시 대기 후 홈 화면으로 이동
          setTimeout(() => {
            console.log("🔄 홈 화면으로 이동 시작");
            router.replace("/(tabs)/home");
          }, 1500);
        } else {
          console.error("❌ 토큰이 없습니다");
          setStatus("error");
          setMessage("로그인에 실패했습니다. 다시 시도해주세요.");

          setTimeout(() => {
            router.replace("/(tabs)/home");
          }, 2000);
        }
      } catch (error) {
        console.error("❌ OAuth2 리디렉트 처리 중 에러:", error);
        setStatus("error");
        setMessage("로그인 처리 중 오류가 발생했습니다.");

        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 2000);
      }
    };

    handleOAuth2Redirect();
  }, [token, router, login]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <ActivityIndicator
              size='large'
              color='#007AFF'
            />
            <Text style={styles.title}>{message}</Text>
            <Text style={styles.subtitle}>잠시만 기다려주세요</Text>
          </>
        );
      case "success":
        return (
          <>
            <Text style={[styles.title, styles.successText]}>{message}</Text>
            <Text style={styles.subtitle}>자동으로 홈 화면으로 이동합니다</Text>
          </>
        );
      case "error":
        return (
          <>
            <Text style={[styles.title, styles.errorText]}>{message}</Text>
            <Text style={styles.subtitle}>홈 화면으로 돌아갑니다</Text>
          </>
        );
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  successText: {
    color: "#34C759",
  },
  errorText: {
    color: "#FF3B30",
  },
});
