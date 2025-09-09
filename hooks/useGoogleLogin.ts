import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

const useGoogleLogin = () => {
  const redirectUri = Linking.createURL("oauth2/redirect");

  const handleGoogleLogin = async () => {
    try {
      // 백엔드 OAuth2 시작 URL
      const backendOAuthUrl =
        "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/oauth2/authorization/google";

      console.log("�� Google OAuth 시작:", backendOAuthUrl);
      console.log("🔍 리디렉트 URI:", redirectUri);

      const result = await WebBrowser.openAuthSessionAsync(
        backendOAuthUrl,
        redirectUri,
        {
          showInRecents: false,
          preferEphemeralSession: true,
        }
      );

      if (result.type === "success" && result.url) {
        // URL에서 토큰과 사용자 정보 추출
        const url = new URL(result.url);
        const token = url.searchParams.get("token");
        const user = url.searchParams.get("user");
        const state = url.searchParams.get("state");

        if (token && user) {
          const userData = JSON.parse(decodeURIComponent(user));
          return {
            type: "success",
            token: token,
            user: userData,
          };
        } else {
          return {
            type: "error",
            error: "토큰 또는 사용자 정보를 찾을 수 없습니다",
          };
        }
      } else if (result.type === "cancel") {
        return { type: "cancel" };
      } else {
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
    promptAsync: handleGoogleLogin,
  };
};

export default useGoogleLogin;
