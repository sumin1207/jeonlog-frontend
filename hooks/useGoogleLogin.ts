import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const useGoogleLogin = () => {
  // 백엔드 OAuth 콜백 URL 사용 (배포된 URL)
  const redirectUri =
    "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/oauth2/redirect";

  const handleBackendOAuth = async () => {
    try {
      // 백엔드 OAuth 시작 URL (배포된 URL)
      const backendOAuthUrl =
        "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/oauth2/authorization/google";

      const result = await WebBrowser.openAuthSessionAsync(
        backendOAuthUrl,
        redirectUri
      );

      if (result.type === "success" && result.url) {
        // URL에서 JWT 토큰과 사용자 정보 추출
        const tokenMatch = result.url.match(/token=([^&]+)/);
        const userMatch = result.url.match(/user=([^&]+)/);

        if (tokenMatch && userMatch) {
          const jwtToken = tokenMatch[1];
          const userData = JSON.parse(decodeURIComponent(userMatch[1]));

          return {
            type: "success",
            token: jwtToken,
            user: userData,
          };
        }
      }
      return result;
    } catch (error) {
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
