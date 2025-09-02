import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { getBackendUrl } from "../../constants/Config";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

interface NaverLoginButtonProps {
  onSuccess?: () => void;
}

const NaverLoginButton = ({ onSuccess }: NaverLoginButtonProps) => {
  const router = useRouter();
  const { login } = useAuth();

  // 네이버 OAuth2 클라이언트 ID
  const NAVER_CLIENT_ID = Constants.expoConfig?.extra?.NAVER_CLIENT_ID;

  const handleNaverLogin = async () => {
    try {
      console.log("🚀 네이버 로그인 시작");

      const backendUrl = getBackendUrl();
      console.log("🔗 백엔드 URL:", backendUrl);

      // 리다이렉트 URL 설정 (플랫폼에 따라 다르게)
      const redirectUri =
        Platform.OS === "web"
          ? "http://localhost:8081/oauth2/redirect"
          : `exp://localhost:8081/oauth2/redirect`;
      console.log("🔄 리다이렉트 URI:", redirectUri);

      // 네이버 OAuth2 인증 URL 생성
      const naverAuthUrl =
        `https://nid.naver.com/oauth2.0/authorize?` +
        `response_type=code&` +
        `client_id=${NAVER_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=naver_login`;

      console.log("🔗 네이버 인증 URL:", naverAuthUrl);

      // 웹 환경에서는 직접 리다이렉트, 앱 환경에서는 팝업 사용
      if (Platform.OS === "web") {
        // 웹 환경에서는 직접 리다이렉트
        window.location.href = naverAuthUrl;
        return;
      }

      // 앱 환경에서는 팝업 사용
      const result = await WebBrowser.openAuthSessionAsync(
        naverAuthUrl,
        redirectUri
      );

      console.log("🔍 인증 결과:", result);

      if (result.type === "success" && result.url) {
        console.log("✅ 인증 성공, URL:", result.url);

        // URL에서 인증 코드 추출
        const url = new URL(result.url);
        const code = url.searchParams.get("code");

        if (code) {
          console.log("🔑 인증 코드 받음:", code.substring(0, 20) + "...");

          // 백엔드로 인증 코드 전송하여 JWT 토큰 받기
          await exchangeCodeForToken(code, backendUrl);

          console.log("🎉 로그인 완료! 홈화면으로 이동합니다.");
          router.replace("/(tabs)/home");

          if (onSuccess) {
            onSuccess();
          }
        } else {
          throw new Error("인증 코드를 받지 못했습니다");
        }
      } else if (result.type === "cancel") {
        console.log("❌ 사용자가 인증을 취소했습니다");
        Alert.alert("로그인 취소", "로그인이 취소되었습니다.");
      } else {
        console.log("❌ 인증 실패:", result);
        Alert.alert("로그인 실패", "인증에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 네이버 로그인 에러:", error);
      Alert.alert("로그인 실패", "네이버 로그인 중 오류가 발생했습니다.");
    }
  };

  // 인증 코드를 백엔드로 전송하여 JWT 토큰 받기
  const exchangeCodeForToken = async (code: string, backendUrl: string) => {
    try {
      console.log("🔄 백엔드로 인증 코드 전송 중...");

      const response = await fetch(`${backendUrl}/api/users/login`, {
        method: "POST",
        mode: "cors", // CORS 명시적 설정
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code,
          provider: "naver", // 네이버 로그인임을 명시
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ 서버 응답:", data);

      // JWT 토큰을 AsyncStorage에 저장
      if (data.token) {
        await AsyncStorage.setItem("jwt_token", data.token);
        console.log("💾 JWT 토큰 저장 완료");

        // 사용자 정보도 함께 저장 (서버에서 제공하는 경우)
        if (data.user) {
          await AsyncStorage.setItem("user_info", JSON.stringify(data.user));
          console.log("💾 사용자 정보 저장 완료:", data.user);

          // AuthContext에 사용자 정보 업데이트
          login({
            id: data.user.id || "unknown",
            name: data.user.name || data.user.email?.split("@")[0] || "사용자",
            email: data.user.email || "unknown@example.com",
            profileImage: data.user.profileImage,
            loginType: "naver",
            accessToken: data.token,
          });
        } else {
          // 서버에서 사용자 정보를 제공하지 않는 경우 토큰에서 추출
          const userInfo = {
            id: "unknown",
            name: "사용자",
            email: "unknown@example.com",
            loginType: "naver" as const,
            accessToken: data.token,
          };
          login(userInfo);
        }
      } else {
        console.error("❌ 서버에서 토큰을 받지 못했습니다");
        throw new Error("서버에서 토큰을 받지 못했습니다");
      }
    } catch (error) {
      console.error("❌ 토큰 교환 에러:", error);

      // 에러 타입별 처리
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            "서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
          );
        } else if (error.message.includes("Failed to fetch")) {
          throw new Error(
            "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
          );
        } else if (error.message.includes("CORS")) {
          throw new Error("서버 설정 오류입니다. 관리자에게 문의해주세요.");
        }
      }

      throw error;
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
