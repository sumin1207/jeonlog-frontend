import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const useGoogleLogin = () => {
  // 앱의 딥링크 스키마 설정
  const redirectUri = Linking.createURL("oauth/google");

  const handleBackendOAuth = async () => {
    try {
      // 백엔드 OAuth 시작 URL (배포된 URL)
      const backendOAuthUrl =
        "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/oauth2/authorization/google";

      console.log("🔍 Google OAuth 시작:", backendOAuthUrl);
      console.log("🔍 리다이렉트 URI:", redirectUri);

      const result = await WebBrowser.openAuthSessionAsync(
        backendOAuthUrl,
        redirectUri,
        {
          // 브라우저에서 앱으로 자동 리다이렉트 설정
          showInRecents: false,
          preferEphemeralSession: true,
        }
      );

      console.log("🔍 OAuth 결과:", result);

      if (result.type === "success" && result.url) {
        console.log("🔍 성공 URL:", result.url);

        // URL에서 JWT 토큰과 사용자 정보 추출
        const url = new URL(result.url);
        const token = url.searchParams.get("token");
        const user = url.searchParams.get("user");

        if (token && user) {
          const userData = JSON.parse(decodeURIComponent(user));
          console.log("✅ Google 로그인 성공:", userData.email);

          return {
            type: "success",
            token: token,
            user: userData,
          };
        } else {
          console.log("⚠️ URL에서 토큰 또는 사용자 정보를 찾을 수 없음");
          return {
            type: "error",
            error: "토큰 또는 사용자 정보를 찾을 수 없습니다",
          };
        }
      } else if (result.type === "cancel") {
        console.log("ℹ️ 사용자가 로그인을 취소함");
        return {
          type: "cancel",
        };
      } else {
        console.log("❌ OAuth 실패:", result);
        return {
          type: "error",
          error: "OAuth 인증에 실패했습니다",
        };
      }
    } catch (error) {
      console.error("❌ Google OAuth 에러:", error);
      return {
        type: "error",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return {
    promptAsync: handleBackendOAuth,
  };
};

export default useGoogleLogin;
