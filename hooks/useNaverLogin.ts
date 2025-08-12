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

  const handleNaverLoginSuccess = async (response: any) => {
    try {
      console.log("🚀 Naver 로그인 응답:", response);

      if (response?.type === "success") {
        console.log("✅ Naver OAuth2 인증 완료, 백엔드로 리디렉트 예정");
        console.log("📋 Authorization Code:", response.params?.code);
        console.log("🔄", response.params?.state);
      } else if (response?.type === "error") {
        console.error("❌ Naver OAuth2 에러:", response.error);
        console.error("🔍 에러 코드:", response.error?.code);
        console.error("📝 에러 메시지:", response.error?.message);
      } else if (response?.type === "cancel") {
        console.log("⚠️ Naver 로그인 취소됨");
      }
    } catch (error) {
      console.error("❌ Naver 로그인 처리 에러:", error);
    }
  };

  // response가 변경될 때마다 로그인 성공 여부를 확인
  useEffect(() => {
    console.log("🔄 Naver OAuth2 응답 변경됨:", response);

    if (response?.type === "success") {
      // 로그인 성공 시 handleNaverLoginSuccess 호출
      handleNaverLoginSuccess(response);
    } else if (response?.type === "error") {
      // 에러 발생 시 상세 정보 출력
      console.error("❌ Naver OAuth2 에러 발생:", response.error);
      handleNaverLoginSuccess(response);
    } else if (response?.type === "cancel") {
      console.log("⚠️ Naver OAuth2 취소됨");
      handleNaverLoginSuccess(response);
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
};

export default useNaverLogin;
