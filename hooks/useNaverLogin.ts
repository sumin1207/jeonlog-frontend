import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const useNaverLogin = () => {
  const NAVER_CLIENT_ID = "y1Hp9eqM11WwuL5rhdfn";
  const NAVER_CLIENT_SECRET = "rnIV0twBdr";

  const discovery = {
    authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
    tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
  };

  // ✅ 네가 현재 접속 중인 포트 8081로 맞춤
  const redirectUri =
    Platform.OS === "web"
      ? "http://localhost:8081"
      : AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: NAVER_CLIENT_ID,
      clientSecret: NAVER_CLIENT_SECRET,
      redirectUri: redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: ["name", "email"],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log("✅ 네이버 인증 코드:", code);

      // 🚩 이후 처리 로직:
      // 1. 서버로 code 전달 -> Access Token 획득
      // 2. 유저 정보 가져오기
      // 3. Firebase Custom Token 발급 후 로그인
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
};

export default useNaverLogin;
