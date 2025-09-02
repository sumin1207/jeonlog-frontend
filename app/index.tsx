import { useRouter } from "expo-router";
import { View, Text, SafeAreaView, Image, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import NaverLoginButton from "../components/auth/NaverLoginButton";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import { checkServerConnection } from "../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [serverStatus, setServerStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [showServerOptions, setShowServerOptions] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  const backgroundColor = "#1c3519";

  // 서버 연결 상태 확인
  useEffect(() => {
    const checkServer = async () => {
      try {
        setServerStatus("checking");
        console.log("🔍 서버 연결 상태 확인 시작");

        const isConnected = await checkServerConnection();
        setServerStatus(isConnected ? "connected" : "disconnected");
        setServerError("");

        if (!isConnected) {
          console.log("⚠️ 서버 연결 실패 - 사용자에게 알림 표시");
          setServerError("서버에 연결할 수 없습니다");
          Alert.alert(
            "서버 연결 실패",
            "서버에 연결할 수 없습니다.\n\n가능한 원인:\n• 서버가 일시적으로 다운됨\n• 네트워크 연결 문제\n• 서버 URL 설정 오류\n\n잠시 후 다시 시도해주세요.",
            [
              { text: "다시 시도", onPress: () => checkServer() },
              { text: "확인" },
            ]
          );
        } else {
          console.log("✅ 서버 연결 성공");
        }
      } catch (error) {
        console.error("서버 연결 확인 에러:", error);
        setServerStatus("disconnected");

        let errorMessage = "알 수 없는 오류";
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage = "요청 타임아웃 - 서버가 응답하지 않습니다";
          } else if (error.message.includes("Failed to fetch")) {
            errorMessage = "네트워크 오류 - 서버에 연결할 수 없습니다";
          } else if (error.message.includes("CORS")) {
            errorMessage = "CORS 오류 - 서버 설정 문제";
          } else {
            errorMessage = error.message;
          }
        }

        setServerError(errorMessage);
        Alert.alert(
          "연결 오류",
          `서버 연결 확인 중 오류가 발생했습니다:\n\n${errorMessage}`,
          [{ text: "확인" }]
        );
      }
    };

    checkServer();
  }, []);

  // 이미 로그인된 사용자는 홈화면으로 자동 리다이렉트
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      console.log("🔍 이미 로그인된 사용자입니다. 홈화면으로 이동합니다.");
      router.replace("/(tabs)/home");
    }
  }, [isLoggedIn, isLoading, router]);

  const handleLoginSuccess = () => {
    console.log("🎉 로그인 성공! 홈화면으로 이동합니다.");
    // 로그인 성공 시 홈화면으로 리다이렉트
    router.replace("/(tabs)/home");
  };

  // 로딩 중이거나 이미 로그인된 경우 로딩 화면 표시
  if (isLoading || isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 18 }}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor }}>
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Image
            source={require("../assets/images/mainIcon.png")}
            style={{
              width: 200,
              height: 200,
              marginBottom: 16,
              borderRadius: 0,
              backgroundColor: "transparent",
            }}
            resizeMode='contain'
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 5,
            textAlign: "center",
            color: "#fff",
          }}>
          간편로그인
        </Text>

        {/* 서버 연결 상태 표시 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 20,
          }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                serverStatus === "connected"
                  ? "#4CAF50"
                  : serverStatus === "checking"
                  ? "#FF9800"
                  : "#F44336",
              marginRight: 8,
            }}
          />
          <Text style={{ color: "#fff", fontSize: 14 }}>
            {serverStatus === "connected"
              ? "서버 연결됨"
              : serverStatus === "checking"
              ? "서버 확인 중..."
              : "서버 연결 실패"}
          </Text>
          {serverStatus === "disconnected" && (
            <View style={{ alignItems: "center", marginTop: 4 }}>
              <Text
                style={{ color: "#ffcccb", fontSize: 12, textAlign: "center" }}>
                연결 실패 - 다시 시도해주세요
              </Text>
              {serverError && (
                <Text
                  style={{
                    color: "#ffcccb",
                    fontSize: 10,
                    textAlign: "center",
                    marginTop: 2,
                  }}>
                  {serverError}
                </Text>
              )}
              <Button
                title='서버 설정'
                color='#FF6B35'
                onPress={() => setShowServerOptions(!showServerOptions)}
              />
            </View>
          )}
        </View>

        {/* 서버 설정 옵션 */}
        {showServerOptions && (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: 15,
              marginBottom: 20,
              marginHorizontal: 20,
            }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                marginBottom: 10,
                textAlign: "center",
              }}>
              서버 연결 문제 해결
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                marginBottom: 10,
                textAlign: "center",
              }}>
              현재 서버:
              http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com
            </Text>
            <Text
              style={{
                color: "#ffcccb",
                fontSize: 10,
                marginBottom: 10,
                textAlign: "center",
              }}>
              💡 CORS 정책으로 인해 서버 연결 확인이 제한됩니다
            </Text>
            <Button
              title='다시 연결 시도'
              color='#4CAF50'
              onPress={() => {
                setShowServerOptions(false);
                setServerError("");
                // 서버 연결 다시 시도
                const checkServer = async () => {
                  setServerStatus("checking");
                  try {
                    const isConnected = await checkServerConnection();
                    setServerStatus(isConnected ? "connected" : "disconnected");
                    if (!isConnected) {
                      setServerError("서버에 연결할 수 없습니다");
                    }
                  } catch (error) {
                    setServerStatus("disconnected");
                    setServerError(
                      error instanceof Error ? error.message : "연결 오류"
                    );
                  }
                };
                checkServer();
              }}
            />
            <Text
              style={{
                color: "#ffcccb",
                fontSize: 10,
                marginTop: 10,
                textAlign: "center",
              }}>
              서버가 일시적으로 다운되었을 수 있습니다. 잠시 후 다시
              시도해주세요.
            </Text>
          </View>
        )}
        <NaverLoginButton onSuccess={handleLoginSuccess} />
        <GoogleLoginButton onSuccess={handleLoginSuccess} />

        {/* 서버 연결 실패 시 안내 메시지 */}
        {serverStatus === "disconnected" && (
          <View
            style={{
              backgroundColor: "rgba(255,0,0,0.1)",
              borderRadius: 8,
              padding: 10,
              marginHorizontal: 20,
              marginTop: 10,
            }}>
            <Text
              style={{ color: "#ffcccb", fontSize: 12, textAlign: "center" }}>
              ⚠️ 서버 연결이 실패했지만 로그인을 시도할 수 있습니다.
            </Text>
            <Text
              style={{
                color: "#ffcccb",
                fontSize: 10,
                textAlign: "center",
                marginTop: 4,
              }}>
              로그인 시 서버 연결을 다시 시도합니다.
            </Text>
            <Text
              style={{
                color: "#ffcccb",
                fontSize: 9,
                textAlign: "center",
                marginTop: 4,
                lineHeight: 11,
              }}>
              💡 CORS 정책으로 인해 서버 연결 확인이 제한됩니다
            </Text>
          </View>
        )}
        {/* 개발용: 홈으로 바로 이동 버튼 */}
        <Button
          title='개발용: 홈으로 이동'
          color='#841584'
          onPress={() => router.replace("/(tabs)/home")}
        />
        {/* 개발용: 온보딩 카테고리로 바로 이동 버튼 */}
        <Button
          title='개발용: 온보딩 카테고리로 이동'
          color='#FF6B35'
          onPress={() => router.replace("/onboarding/category")}
        />
      </View>
    </SafeAreaView>
  );
}
