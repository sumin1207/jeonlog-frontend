import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra as {
  EXPO_NAVER_CLIENT_ID: string;
  EXPO_NAVER_CLIENT_SECRET: string;
};

const NAVER_CLIENT_ID = extra?.EXPO_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = extra?.EXPO_NAVER_CLIENT_SECRET;
console.log(NAVER_CLIENT_ID);

WebBrowser.maybeCompleteAuthSession();

const useNaverLogin = () => {
  const discovery = {
    authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
    tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
  };

  const redirectUri = AuthSession.makeRedirectUri();

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
      const { code, state } = response.params;
      console.log("✅ 네이버 인증 코드:", code);
      console.log("✅ 네이버 state:", state);

      // 이후 처리:
      // 1. code 를 백엔드로 전송하여 access_token 및 사용자 정보 가져오기
      // 2. Firebase Custom Token으로 로그인 연동
      // 3. Firestore 사용자 데이터 등록
    } else if (response?.type === "error") {
      console.error("❌ 네이버 로그인 에러:", response.error);
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
};

export default useNaverLogin;
