import * as WebBrowser from "expo-web-browser";
import { Platform, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const useNaverLogin = () => {
  // 앱의 딥링크 스키마 설정
  const redirectUri = Linking.createURL("oauth2/redirect");

  const handleNaverLogin = async () => {
    try {
      // 네이버 OAuth2 URL로 직접 접근
      const naverOAuthUrl =
        "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=BdCBy0EeGReTY_t0yT5m&scope=name%20email&state=pQ1WMGyjhF2OUXoVeatru3pdT__Ay1MAojmf4MqjIjg%3D&redirect_uri=http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/login/oauth2/code/naver";

      console.log("🔍 Naver OAuth 팝업 시작:", naverOAuthUrl);
      console.log("🔍 리디렉트 URI:", redirectUri);

      let result;
      try {
        result = await WebBrowser.openAuthSessionAsync(
          naverOAuthUrl,
          redirectUri,
          {
            showInRecents: false,
            preferEphemeralSession: true,
            presentationStyle:
              WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
          }
        );

        console.log("🔍 Naver OAuth 팝업 결과:", result);
      } catch (webBrowserError) {
        console.log("⚠️ WebBrowser 실패, Linking으로 대체:", webBrowserError);

        // WebBrowser가 실패하면 Linking으로 대체
        Alert.alert("로그인", "네이버 로그인 페이지로 이동합니다.", [
          { text: "취소", style: "cancel" },
          {
            text: "이동",
            onPress: () => {
              Linking.openURL(naverOAuthUrl);
            },
          },
        ]);

        return { type: "cancel" };
      }

      if (result.type === "success" && result.url) {
        console.log("🔍 성공 URL:", result.url);

        // URL에서 토큰과 사용자 정보 추출
        const url = new URL(result.url);
        const token = url.searchParams.get("token");
        const user = url.searchParams.get("user");
        const state = url.searchParams.get("state");

        if (token && user) {
          const userData = JSON.parse(decodeURIComponent(user));
          console.log("✅ Naver 로그인 성공:", userData.email);

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
        console.log("ℹ️ Naver 로그인 취소됨");
        return { type: "cancel" };
      } else {
        console.log("❌ Naver OAuth 실패");
        return {
          type: "error",
          error: "OAuth 인증에 실패했습니다",
        };
      }
    } catch (error) {
      console.error("❌ Naver OAuth 에러:", error);
      return {
        type: "error",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return {
    promptAsync: handleNaverLogin,
  };
};

export default useNaverLogin;
