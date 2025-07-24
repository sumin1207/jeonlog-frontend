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
  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  const redirectUri =
    Platform.OS === "web"
      ? "http://localhost:8081"
      : AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log("✅ 구글 인증 코드:", code);
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
};

export default useGoogleLogin;
