import React, { useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import useGoogleLogin from "../../hooks/useGoogleLogin";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

const GoogleLoginButton = ({ onSuccess }: GoogleLoginButtonProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const { promptAsync, request, response, backendTokenExchangeUrl } =
    useGoogleLogin();

  // 모바일용 구글 로그인 초기화
  useEffect(() => {
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId:
          "565177569555-np7c056iomm3dno1k32lpqskorkmld6n.apps.googleusercontent.com",
        offlineAccess: true,
      });
    }
  }, []);

  // OAuth 응답 처리 (웹용)
  useEffect(() => {
    if (Platform.OS === "web") {
      if (response?.type === "success") {
        handleOAuthSuccess(response.params.code);
      } else if (response?.type === "error") {
        console.error("❌ OAuth 에러:", response.error);
        Alert.alert("로그인 실패", "구글 로그인에 실패했습니다.");
      }
    }
  }, [response]);

  const handleOAuthSuccess = async (code: string) => {
    try {
      console.log("🚀 OAuth 코드 받음:", code);

      // CORS 문제 해결을 위한 요청 옵션
      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code: code,
          redirectUri:
            Platform.OS === "web"
              ? typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost:8081"
              : undefined,
        }),
        mode: "cors", // CORS 모드 명시적 설정
      };

      console.log("🌐 요청 URL:", backendTokenExchangeUrl);
      console.log("📤 요청 옵션:", requestOptions);

      try {
        // 백엔드로 코드 전송하여 JWT 토큰 받기
        const response = await fetch(backendTokenExchangeUrl, requestOptions);

        console.log("📥 응답 상태:", response.status);
        console.log(
          "📥 응답 헤더:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ 서버 에러 응답:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data = await response.json();
        console.log("✅ 백엔드 응답:", data);

        if (data.token && data.user) {
          // JWT 토큰 저장
          const AsyncStorage = (
            await import("@react-native-async-storage/async-storage")
          ).default;
          await AsyncStorage.setItem("jwt_token", data.token);
          await AsyncStorage.setItem("user_info", JSON.stringify(data.user));

          // AuthContext에 저장
          login(data.user);
          router.replace("/(tabs)/home");

          if (onSuccess) {
            onSuccess();
          }
        } else {
          throw new Error("토큰 또는 사용자 정보가 없습니다.");
        }
      } catch (fetchError) {
        // CORS 에러인 경우 대안 방법 시도
        if (
          fetchError instanceof TypeError &&
          fetchError.message.includes("Failed to fetch")
        ) {
          console.log("🔄 CORS 에러 감지, 대안 방법 시도...");
          await handleOAuthSuccessFallback(code);
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error("❌ OAuth 후처리 에러:", error);

      // CORS 에러인지 확인
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        Alert.alert(
          "CORS 에러",
          "서버에서 CORS 설정이 필요합니다. 개발자에게 문의하세요.\n\n에러: " +
            error.message
        );
      } else {
        Alert.alert(
          "로그인 실패",
          "구글 로그인에 실패했습니다.\n\n에러: " +
            (error instanceof Error ? error.message : String(error))
        );
      }
    }
  };

  // CORS 문제 시 대안 방법 (클라이언트에서 직접 구글 API 호출)
  const handleOAuthSuccessFallback = async (code: string) => {
    try {
      console.log("🔄 대안 방법: 클라이언트에서 직접 구글 API 호출");

      // 구글 액세스 토큰 요청
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id:
            "565177569555-np7c056iomm3dno1k32lpqskorkmld6n.apps.googleusercontent.com",
          client_secret: "GOCSPX-your-client-secret", // 실제 클라이언트 시크릿 필요
          code: code,
          redirect_uri: "http://localhost:8081",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`토큰 요청 실패: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log("✅ 구글 토큰 응답:", tokenData);

      if (tokenData.access_token) {
        // 구글 사용자 정보 요청
        const userResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error(`사용자 정보 요청 실패: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log("✅ 구글 사용자 정보:", userData);

        // 사용자 정보 생성
        const user = {
          id: userData.id || `google_${Date.now()}`,
          name: userData.name || "구글 사용자",
          email: userData.email || "user@gmail.com",
          profileImage: userData.picture,
          loginType: "google" as const,
          accessToken: tokenData.access_token,
        };

        console.log("👤 생성된 사용자 정보:", user);

        // JWT 토큰 저장 (임시로 액세스 토큰 사용)
        const AsyncStorage = (
          await import("@react-native-async-storage/async-storage")
        ).default;
        await AsyncStorage.setItem("jwt_token", tokenData.access_token);
        await AsyncStorage.setItem("user_info", JSON.stringify(user));

        // AuthContext에 저장
        login(user);
        router.replace("/(tabs)/home");

        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("구글 액세스 토큰을 받을 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ 대안 방법도 실패:", error);
      throw error;
    }
  };

  // 모바일용 구글 로그인
  const handleMobileGoogleLogin = async () => {
    try {
      console.log("🚀 모바일 구글 로그인 시작");

      // 구글 로그인 실행
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      console.log("✅ 구글 로그인 성공:", result);

      // 사용자 정보 생성
      console.log("🔍 구글 로그인 결과 구조:", JSON.stringify(result, null, 2));

      const user = {
        id:
          (result as any).user?.id ||
          (result as any).data?.user?.id ||
          `google_${Date.now()}`,
        name:
          (result as any).user?.name ||
          (result as any).data?.user?.name ||
          "구글 사용자",
        email:
          (result as any).user?.email ||
          (result as any).data?.user?.email ||
          "user@gmail.com",
        profileImage:
          (result as any).user?.photo || (result as any).data?.user?.photo,
        loginType: "google" as const,
        accessToken:
          (result as any).idToken ||
          (result as any).data?.idToken ||
          (result as any).accessToken,
      };

      // JWT 토큰 저장 (임시로 액세스 토큰 사용)
      const AsyncStorage = (
        await import("@react-native-async-storage/async-storage")
      ).default;
      await AsyncStorage.setItem("jwt_token", user.accessToken || "");
      await AsyncStorage.setItem("user_info", JSON.stringify(user));

      // AuthContext에 저장
      login(user);
      router.replace("/(tabs)/home");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("❌ 모바일 구글 로그인 에러:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("로그인 취소", "구글 로그인이 취소되었습니다.");
      } else {
        Alert.alert("로그인 실패", "구글 로그인에 실패했습니다.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("🚀 구글 로그인 시작");

      if (Platform.OS === "web") {
        // 웹에서는 OAuth 팝업으로 처리
        if (request) {
          await promptAsync();
        } else {
          Alert.alert("오류", "구글 로그인을 초기화할 수 없습니다.");
        }
      } else {
        // 모바일에서는 네이티브 구글 로그인 사용
        await handleMobileGoogleLogin();
      }
    } catch (error) {
      console.error("❌ 구글 로그인 에러:", error);
      Alert.alert("로그인 실패", "구글 로그인에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4285F4" }]}
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

export default GoogleLoginButton;
