import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../../components/context/AuthContext";

export default function OAuth2Redirect() {
  const router = useRouter();
  const { token, state, error } = useLocalSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("로그인 처리 중...");

  useEffect(() => {
    const handle = async () => {
      if (error) {
        setStatus("error");
        setMessage("인증 오류가 발생했습니다.");
        setTimeout(() => router.replace("/"), 1500);
        return;
      }

      if (token && typeof token === "string") {
        console.log("🔑 토큰 수신:", token.substring(0, 20) + "...");

        // state 값으로 로그인 타입 추정
        let loginType: "google" | "naver" = "google";
        if (state === "naver_login") loginType = "naver";

        const tempUser = {
          id: `${loginType}_user_${Date.now()}`,
          name: loginType === "naver" ? "네이버 사용자" : "구글 사용자",
          email: `user@${loginType}.com`,
          profileImage: undefined,
          loginType,
          accessToken: token,
        };

        login(tempUser);
        setStatus("success");
        setMessage("로그인 성공!");

        setTimeout(() => router.replace("/(tabs)/home"), 1500);
      } else {
        setStatus("error");
        setMessage("토큰이 전달되지 않았습니다.");
        setTimeout(() => router.replace("/"), 1500);
      }
    };

    handle();
  }, [token, state, error, login, router]);

  return (
    <View style={styles.container}>
      {status === "loading" && (
        <>
          <ActivityIndicator
            size='large'
            color='#007AFF'
          />
          <Text style={styles.title}>{message}</Text>
        </>
      )}
      {status === "success" && (
        <>
          <Text style={[styles.title, styles.successText]}>{message}</Text>
          <Text>자동으로 홈 화면으로 이동합니다</Text>
        </>
      )}
      {status === "error" && (
        <>
          <Text style={[styles.title, styles.errorText]}>{message}</Text>
          <Text>홈 화면으로 돌아갑니다</Text>
        </>
      )}
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
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  successText: { color: "#34C759" },
  errorText: { color: "#FF3B30" },
});
