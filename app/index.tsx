import { useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  Alert,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import { SocialLoginButtons } from "../components/auth";
import ServerConfigModal from "../components/auth/ServerConfigModal";
import {
  checkServerConnection,
  authService,
  userService,
} from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, login } = useAuth();
  const [serverStatus, setServerStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [showServerOptions, setShowServerOptions] = useState(false);
  const [showServerConfigModal, setShowServerConfigModal] = useState(false);
  const [serverError, setServerError] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [currentServerUrl, setCurrentServerUrl] = useState<string>("");

  const backgroundColor = "#1c3519";

  // 서버 URL 로드 및 연결 상태 확인
  useEffect(() => {
    const loadServerConfig = async () => {
      try {
        // 저장된 커스텀 서버 URL 확인
        const customServerUrl = await AsyncStorage.getItem("custom_server_url");
        const defaultServerUrl =
          "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com";
        const serverUrl = customServerUrl || defaultServerUrl;

        setCurrentServerUrl(serverUrl);
        console.log("🔍 사용할 서버 URL:", serverUrl);

        // 서버 연결 상태 확인
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
            "서버에 연결할 수 없습니다.\n\n가능한 원인:\n• 서버가 일시적으로 다운됨\n• 네트워크 연결 문제\n• 서버 URL 설정 오류\n\n잠시 후 다시 시도하거나 서버 설정을 확인해주세요.",
            [
              { text: "다시 시도", onPress: () => loadServerConfig() },
              {
                text: "서버 설정",
                onPress: () => setShowServerConfigModal(true),
              },
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
          [
            { text: "확인" },
            {
              text: "서버 설정",
              onPress: () => setShowServerConfigModal(true),
            },
          ]
        );
      }
    };

    loadServerConfig();
  }, []);

  // 이미 로그인된 사용자는 온보딩 카테고리로 자동 리다이렉트
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      console.log(
        "🔍 이미 로그인된 사용자입니다. 온보딩 카테고리로 이동합니다."
      );
      router.replace("/onboarding/category");
    }
  }, [isLoggedIn, isLoading, router]);

  const handleLoginSuccess = () => {
    console.log("🎉 로그인 성공! 온보딩 카테고리로 이동합니다.");
    // 로그인 성공 시 온보딩 카테고리로 리다이렉트
    router.replace("/onboarding/category");
  };

  // JWT 토큰 유효성 검사
  const isValidJWT = (token: string): boolean => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return false;
      }

      try {
        const decodedPayload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedPayload.exp && decodedPayload.exp <= currentTime) {
          return false;
        }

        return true;
      } catch (decodeError) {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // JWT 토큰으로 직접 로그인 처리 (개발용)
  const handleTokenLogin = async (token: string) => {
    try {
      if (!isValidJWT(token)) {
        Alert.alert("토큰 오류", "유효하지 않은 JWT 토큰입니다.");
        return;
      }

      await authService.saveToken(token);

      const tokenParts = token.split(".");
      let userEmail = "unknown@user.com";

      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        userEmail = payload.sub || payload.email || "unknown@user.com";
      } catch (e) {
        // JWT에서 이메일 추출 실패
      }

      // 사용자 정보 조회 시도
      try {
        const userData = await userService.getCurrentUser();
        if (userData) {
          const userInfoWithLoginType = {
            ...userData,
            loginType: "google" as const, // Default, actual provider is unknown here
          };
          login(userInfoWithLoginType);

          Alert.alert(
            "로그인 성공",
            `JWT 토큰으로 로그인되었습니다!\n\nID: ${userData.id}\n이메일: ${userData.email}\n이름: ${userData.name}`
          );
          router.replace("/onboarding/category");
          return;
        }
      } catch (corsError) {
        // CORS 에러 시 JWT에서 추출한 정보로 로그인
      }

      const extractedUserData = {
        email: userEmail,
        name: userEmail.split("@")[0],
        id: userEmail,
        loginType: "google" as const, // Default, actual provider is unknown here
      };

      await authService.saveUserInfo(extractedUserData);
      login(extractedUserData);

      Alert.alert(
        "로그인 성공",
        `JWT 토큰으로 로그인되었습니다!\n\n이메일: ${userEmail}`
      );
      router.replace("/onboarding/category");
    } catch (error) {
      Alert.alert("로그인 실패", "토큰이 유효하지 않습니다.");
    }
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
                onPress={() => setShowServerConfigModal(true)}
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
        <SocialLoginButtons onSuccess={handleLoginSuccess} />

        {/* 개발용 JWT 토큰 입력 기능 */}
        {__DEV__ && (
          <View
            style={{
              margin: 20,
              padding: 15,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#fff",
                textAlign: "center",
              }}>
              🔧 개발용: JWT 토큰 직접 입력
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#ffcccb",
                marginBottom: 10,
                textAlign: "center",
                lineHeight: 16,
              }}>
              💡 일반 사용자는 위의 소셜 로그인 버튼을 사용하세요
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
                borderRadius: 4,
                padding: 10,
                marginBottom: 10,
                backgroundColor: "rgba(255,255,255,0.1)",
                fontSize: 12,
                fontFamily: "monospace",
                color: "#fff",
              }}
              placeholder='JWT 토큰을 여기에 붙여넣으세요'
              placeholderTextColor='rgba(255,255,255,0.5)'
              multiline
              numberOfLines={4}
              value={tokenInput}
              onChangeText={setTokenInput}
            />
            <Button
              title='토큰으로 로그인'
              color='#FF6B35'
              onPress={() => {
                if (tokenInput.trim()) {
                  handleTokenLogin(tokenInput.trim());
                } else {
                  Alert.alert("알림", "JWT 토큰을 입력해주세요.");
                }
              }}
              disabled={!tokenInput.trim()}
            />
            <Text
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 16,
                marginTop: 8,
                textAlign: "center",
              }}>
              백엔드에서 받은 JWT 토큰을 위에 붙여넣고 "토큰으로 로그인" 버튼을
              클릭하세요.
            </Text>
          </View>
        )}

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

        {/* 서버 설정 모달 */}
        <ServerConfigModal
          visible={showServerConfigModal}
          onClose={() => setShowServerConfigModal(false)}
          onServerChange={(newServerUrl) => {
            setCurrentServerUrl(newServerUrl);
            // 서버 변경 후 다시 연결 확인
            const checkServer = async () => {
              setServerStatus("checking");
              try {
                const isConnected = await checkServerConnection();
                setServerStatus(isConnected ? "connected" : "disconnected");
                if (!isConnected) {
                  setServerError("서버에 연결할 수 없습니다");
                } else {
                  setServerError("");
                }
              } catch (error) {
                setServerStatus("disconnected");
                setServerError("서버 연결 확인 실패");
              }
            };
            checkServer();
          }}
          currentServerUrl={currentServerUrl}
        />
      </View>
    </SafeAreaView>
  );
}
