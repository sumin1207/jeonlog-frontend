import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import useGoogleLogin from "../../hooks/useGoogleLogin";
import useNaverLogin from "../../hooks/useNaverLogin";
import {
  authService,
  userService,
  isTokenValid,
} from "../../services/authService";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface SocialLoginButtonsProps {
  onSuccess?: () => void;
}

const SocialLoginButtons = ({ onSuccess }: SocialLoginButtonsProps) => {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const { promptAsync: googlePromptAsync } = useGoogleLogin();
  const { promptAsync: naverPromptAsync } = useNaverLogin();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId:
          "565177569555-np7c056iomm3dno1k32lpqskorkmld6n.apps.googleusercontent.com",
        offlineAccess: true,
      });
    }
  }, []);

  const handleLogin = async (
    providerPromptAsync: () => Promise<any>,
    provider: "google" | "naver"
  ) => {
    // 이미 로그인된 사용자인 경우 토큰 유효성 검사 후 홈으로 리다이렉트
    if (isLoggedIn) {
      console.log("🔍 이미 로그인된 사용자입니다. 토큰 유효성 검사 중...");

      try {
        // 저장된 토큰 확인
        const token = await authService.getToken();
        if (token && isTokenValid(token)) {
          console.log("✅ 토큰이 유효합니다. 홈으로 이동합니다.");
          router.replace("/(tabs)/home");
          return;
        } else {
          console.log("⚠️ 토큰이 유효하지 않습니다. 다시 로그인합니다.");
          // 토큰이 유효하지 않으면 로그아웃 후 새로 로그인
          await authService.logout();
        }
      } catch (error) {
        console.log("⚠️ 토큰 검사 중 오류:", error);
      }
    }

    setIsLoading(true);
    try {
      console.log(`🔍 ${provider} 로그인 시작`);
      const result = await providerPromptAsync();

      console.log(`🔍 ${provider} 로그인 결과:`, result);

      if (result.type === "success" && result.token && result.user) {
        console.log(`✅ ${provider} 로그인 성공, 토큰 저장 중...`);

        await authService.saveToken(result.token);
        await authService.saveUserInfo(result.user);

        const userInfoWithLoginType = {
          ...result.user,
          loginType: provider,
        };

        console.log(
          `✅ ${provider} 사용자 정보 저장 완료:`,
          userInfoWithLoginType.email
        );
        login(userInfoWithLoginType);

        if (onSuccess) {
          onSuccess();
        }
      } else if (result.type === "cancel") {
        console.log(`ℹ️ ${provider} 로그인 취소됨`);
        // 사용자가 취소한 경우 알림을 표시하지 않음
      } else {
        console.log(
          `❌ ${provider} 로그인 실패:`,
          result.error || "알 수 없는 오류"
        );
        Alert.alert(
          "로그인 실패",
          `${
            provider === "google" ? "구글" : "네이버"
          } 로그인에 실패했습니다.\n\n${
            result.error || "알 수 없는 오류가 발생했습니다."
          }`
        );
      }
    } catch (error) {
      console.error(`❌ ${provider} 로그인 에러:`, error);
      Alert.alert(
        "로그인 실패",
        `${
          provider === "google" ? "구글" : "네이버"
        } 로그인 중 오류가 발생했습니다.\n\n` +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4285F4" }]}
        onPress={() => handleLogin(googlePromptAsync, "google")}
        disabled={isLoading}>
        <View style={styles.buttonContent}>
          {isLoading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <>
              <Ionicons
                name='logo-google'
                size={18}
                color='white'
              />
              <Text style={styles.text}>구글로 로그인</Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.naverButton]}
        onPress={() => handleLogin(naverPromptAsync, "naver")}
        disabled={isLoading}>
        <View style={styles.buttonContent}>
          {isLoading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <>
              <Text style={styles.naverLogo}>N</Text>
              <Text style={[styles.text, styles.naverText]}>
                네이버로 로그인
              </Text>
            </>
          )}
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
    marginBottom: 10,
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
  naverButton: {
    backgroundColor: "#03c75a",
  },
  naverLogo: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  naverText: {
    color: "#fff",
  },
});

export default SocialLoginButtons;
