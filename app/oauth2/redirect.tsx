// OAuth2 리디렉트 페이지
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/context/AuthContext";
import { getBackendUrl } from "../../constants/Config";

export default function OAuth2Redirect() {
  const router = useRouter();
  const { code, state, error } = useLocalSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("로그인 처리 중...");

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        console.log("🔍 OAuth2 리다이렉트 파라미터:", { code, state, error });

        // 에러가 있는 경우
        if (error) {
          console.error("❌ OAuth2 인증 에러:", error);
          setStatus("error");
          setMessage("인증 중 오류가 발생했습니다.");
          setTimeout(() => {
            router.replace("/");
          }, 2000);
          return;
        }

        // 인증 코드가 있는 경우
        if (code) {
          console.log(
            "🔑 인증 코드 받음:",
            (code as string).substring(0, 20) + "..."
          );

          // state 파라미터로 로그인 타입 확인
          const loginType = state === "naver_login" ? "naver" : "google";
          console.log("🔍 로그인 타입:", loginType);

          // 백엔드로 인증 코드 전송하여 JWT 토큰 받기
          await exchangeCodeForToken(code as string, loginType);

          setStatus("success");
          setMessage("로그인 성공!");

          // 잠시 대기 후 홈 화면으로 이동
          setTimeout(() => {
            console.log("🔄 홈 화면으로 이동 시작");
            router.replace("/(tabs)/home");
          }, 1500);
        } else {
          console.error("❌ 인증 코드가 없습니다");
          setStatus("error");
          setMessage("인증 코드를 받지 못했습니다. 다시 시도해주세요.");

          setTimeout(() => {
            router.replace("/");
          }, 2000);
        }
      } catch (error) {
        console.error("❌ OAuth2 리다이렉트 처리 중 에러:", error);
        setStatus("error");
        setMessage("로그인 처리 중 오류가 발생했습니다.");

        setTimeout(() => {
          router.replace("/");
        }, 2000);
      }
    };

    handleOAuth2Redirect();
  }, [code, state, error, router, login]);

  // 인증 코드를 백엔드로 전송하여 JWT 토큰 받기
  const exchangeCodeForToken = async (code: string, loginType: string) => {
    try {
      console.log("🔄 백엔드로 인증 코드 전송 중...");

      const backendUrl = getBackendUrl();
      console.log("🔗 백엔드 URL:", backendUrl);

      const response = await fetch(`${backendUrl}/api/users/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code,
          provider: loginType,
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
            loginType: loginType as "google" | "naver",
            accessToken: data.token,
          });
        } else {
          // 서버에서 사용자 정보를 제공하지 않는 경우 기본값 사용
          const userInfo = {
            id: "unknown",
            name: "사용자",
            email: "unknown@example.com",
            loginType: loginType as "google" | "naver",
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
      throw error;
    }
  };

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
