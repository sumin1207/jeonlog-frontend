import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import useGoogleLogin from "../../hooks/useGoogleLogin";
import { getBackendUrl } from "../../constants/Config";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

const GoogleLoginButton = ({ onSuccess }: GoogleLoginButtonProps) => {
  const { promptAsync } = useGoogleLogin();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      console.log("🚀 Google 로그인 시작");

      // 백엔드 URL 가져오기
      const backendUrl = getBackendUrl();
      console.log("🔗 백엔드 서버:", backendUrl);

      // Google OAuth2 인증 시작
      const result = await promptAsync();

      if (result?.type === "success") {
        console.log("✅ Google OAuth2 인증 성공");
        console.log("📋 Authorization Code:", result.params?.code);

        // 백엔드로 인증 코드 전송하여 JWT 토큰 받기
        await exchangeCodeForToken(result.params?.code, backendUrl);

        console.log("🎉 로그인 완료! 홈화면으로 이동합니다.");

        // 홈화면으로 리다이렉트
        router.replace("/(tabs)/home");

        if (onSuccess) {
          onSuccess();
        }
      } else if (result?.type === "cancel") {
        console.log("⚠️ Google 로그인 취소됨");
      } else if (result?.type === "error") {
        console.error("❌ Google 로그인 에러:", result.error);
        Alert.alert("로그인 실패", "Google 로그인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("❌ Google 로그인 처리 에러:", error);
      Alert.alert("로그인 실패", "Google 로그인 중 오류가 발생했습니다.");
    }
  };

  // 인증 코드를 백엔드로 전송하여 JWT 토큰 받기
  const exchangeCodeForToken = async (code: string, backendUrl: string) => {
    try {
      console.log("🔄 백엔드로 인증 코드 전송 중...");

      const response = await fetch(`${backendUrl}/api/auth/google/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        "✅ JWT 토큰 받기 성공:",
        data.token ? "토큰 있음" : "토큰 없음"
      );

      // JWT 토큰을 AsyncStorage에 저장
      if (data.token) {
        await AsyncStorage.setItem("jwt_token", data.token);
        console.log("💾 JWT 토큰 저장 완료");
      }
    } catch (error) {
      console.error("❌ 토큰 교환 에러:", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleLogin}>
        <View style={styles.buttonContent}>
          <Ionicons
            name='logo-google'
            size={18}
            color='white'
          />
          <Text style={styles.text}>구글로 로그인</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  button: {
    backgroundColor: "#4285F4",
    padding: 12,
    width: "80%",
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GoogleLoginButton;
