import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

interface NaverLoginButtonProps {
  onSuccess?: () => void;
}

const NaverLoginButton = ({ onSuccess }: NaverLoginButtonProps) => {
  const handleNaverLogin = async () => {
    try {
      console.log("🚀 네이버 로그인 시작");

      // 백엔드의 OAuth2 엔드포인트로 직접 이동
      // 백엔드에서 네이버 OAuth2 인증을 처리하고 JWT 토큰을 생성한 후
      // 프론트엔드의 /oauth2/redirect로 리디렉트할 예정
      const backendOAuthUrl =
        "http://localhost:8080/oauth2/authorization/naver";
      console.log("🔄 백엔드 OAuth2 엔드포인트로 이동:", backendOAuthUrl);

      // 웹 브라우저로 백엔드 OAuth2 엔드포인트 열기
      const result = await WebBrowser.openAuthSessionAsync(
        backendOAuthUrl,
        "http://localhost:8081/oauth2/redirect"
      );

      console.log("🔍 WebBrowser 결과:", result);

      if (result.type === "success") {
        console.log("✅ 네이버 로그인 성공");
        if (onSuccess) {
          onSuccess();
        }
      } else if (result.type === "cancel") {
        console.log("⚠️ 네이버 로그인 취소됨");
      } else if (result.type === "dismiss") {
        console.log("⚠️ 네이버 로그인 창이 닫힘");
      } else {
        console.log("ℹ️ 네이버 로그인 결과:", result.type);
      }
    } catch (error) {
      console.error("❌ 네이버 로그인 처리 에러:", error);
      Alert.alert("로그인 실패", "네이버 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1EC800" }]}
        onPress={handleNaverLogin}>
        <View style={styles.buttonContent}>
          <Ionicons
            name='logo-github'
            size={18}
            color='white'
          />
          <Text style={styles.text}>네이버로 로그인</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  button: {
    width: "80%",
    padding: 12,
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

export default NaverLoginButton;
