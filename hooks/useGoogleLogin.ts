import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

const { EXPO_GOOGLE_CLIENT_ID } = Constants.expoConfig?.extra as {
  EXPO_GOOGLE_CLIENT_ID: string;
};

WebBrowser.maybeCompleteAuthSession();

const useGoogleLogin = () => {
  const CLIENT_ID = EXPO_GOOGLE_CLIENT_ID;

  // CLIENT_ID 검증
  if (!CLIENT_ID) {
    console.error("❌ EXPO_GOOGLE_CLIENT_ID가 설정되지 않았습니다!");
    console.error("🔍 app.config.js 또는 .env 파일을 확인해주세요.");
  } else {
    console.log(
      "✅ Google Client ID 확인됨:",
      CLIENT_ID.substring(0, 10) + "..."
    );
  }

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    userInfoEndpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
  };

  const redirectUri =
    Platform.OS === "web"
      ? "http://localhost:8081"
      : AuthSession.makeRedirectUri();

  // 리디렉트 URI 검증
  console.log("🌐 Platform:", Platform.OS);
  console.log("🔗 Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      console.log("🚀 Google 로그인 응답:", response);

      if (response?.type === "success") {
        console.log("✅ Google OAuth2 인증 완료, 백엔드로 리디렉트 예정");
        console.log("📋 Authorization Code:", response.params?.code);
        console.log("🔄 백엔드에서 JWT 토큰 생성 후 리디렉트 예정");
      } else if (response?.type === "error") {
        console.error("❌ Google OAuth2 에러:", response.error);
        console.error("🔍 에러 코드:", response.error?.code);
        console.error("📝 에러 메시지:", response.error?.message);
      } else if (response?.type === "cancel") {
        console.log("⚠️ Google 로그인 취소됨");
      }
    } catch (error) {
      console.error("❌ Google 로그인 처리 에러:", error);
    }
  };

  // response가 변경될 때마다 로그인 성공 여부를 확인
  useEffect(() => {
    console.log("🔄 Google OAuth2 응답 변경됨:", response);

    if (response?.type === "success") {
      // 로그인 성공 시 handleGoogleLoginSuccess 호출
      handleGoogleLoginSuccess(response);
    } else if (response?.type === "error") {
      // 에러 발생 시 상세 정보 출력
      console.error("❌ Google OAuth2 에러 발생:", response.error);
      handleGoogleLoginSuccess(response);
    } else if (response?.type === "cancel") {
      console.log("⚠️ Google OAuth2 취소됨");
      handleGoogleLoginSuccess(response);
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
};

export default useGoogleLogin;
