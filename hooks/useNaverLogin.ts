import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import Constants from "expo-constants";

const { EXPO_NAVER_CLIENT_ID } = Constants.expoConfig?.extra as {
  EXPO_NAVER_CLIENT_ID: string;
};

WebBrowser.maybeCompleteAuthSession();

const useNaverLogin = () => {
  const CLIENT_ID = EXPO_NAVER_CLIENT_ID;

  // CLIENT_ID 검증
  if (!CLIENT_ID) {
    console.error("❌ EXPO_NAVER_CLIENT_ID가 설정되지 않았습니다!");
    console.error("🔍 app.config.js 또는 .env 파일을 확인해주세요.");
  } else {
    console.log(
      "✅ Naver Client ID 확인됨:",
      CLIENT_ID.substring(0, 10) + "..."
    );
  }

  const discovery = {
    authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
    tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
    revocationEndpoint: "https://nid.naver.com/oauth2.0/token",
    userInfoEndpoint: "https://openapi.naver.com/v1/nid/me",
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

  return {
    promptAsync,
    request,
    response,
  };
};

export default useNaverLogin;
