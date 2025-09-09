import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform, Alert } from "react-native";

const useGoogleLogin = () => {
  const redirectUri = Linking.createURL("oauth2/redirect");

  const handleGoogleLogin = async () => {
    try {
      // 네이티브 앱에서는 Google Sign-In SDK 사용
      if (Platform.OS !== "web") {
        console.log("🔍 네이티브 Google Sign-In 시작");

        // Google Sign-In 초기화 확인
        await GoogleSignin.hasPlayServices();

        // 로그인 시도
        const userInfo = await GoogleSignin.signIn();
        console.log("✅ Google Sign-In 성공:", userInfo.data?.user?.email);

        // 백엔드에 토큰 검증 요청
        const serverUrl =
          "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com";
        const response = await fetch(`${serverUrl}/api/auth/google/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: userInfo.data?.idToken,
            accessToken: userInfo.data?.serverAuthCode,
          }),
        });

        if (response.ok) {
          const authData = await response.json();
          return {
            type: "success",
            token: authData.token,
            user: {
              id: userInfo.data?.user?.id,
              name: userInfo.data?.user?.name,
              email: userInfo.data?.user?.email,
              profileImage: userInfo.data?.user?.photo,
            },
          };
        } else {
          throw new Error("서버 토큰 검증 실패");
        }
      } else {
        // 웹에서는 구글 OAuth2 URL로 직접 접근
        const googleOAuthUrl =
          "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&client_id=609150805805-sf54m0ckvdo5qvpgvineu8souo99uvfb.apps.googleusercontent.com&scope=profile%20email&state=0Lq-P_jPKcfPXbXw11zwYJwRVUKnMnYwnLFHfwDgX2Y%3D&redirect_uri=http%3A%2F%2Fjeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com%2Flogin%2Foauth2%2Fcode%2Fgoogle&service=lso&o2v=2&flowName=GeneralOAuthFlow";

        console.log("🔍 웹 Google OAuth 팝업 시작:", googleOAuthUrl);
        console.log("🔍 리디렉트 URI:", redirectUri);

        let result;
        try {
          result = await WebBrowser.openAuthSessionAsync(
            googleOAuthUrl,
            redirectUri,
            {
              showInRecents: false,
              preferEphemeralSession: true,
              presentationStyle:
                WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
            }
          );

          console.log("🔍 Google OAuth 팝업 결과:", result);
        } catch (webBrowserError) {
          console.log("⚠️ WebBrowser 실패, Linking으로 대체:", webBrowserError);

          // WebBrowser가 실패하면 Linking으로 대체
          Alert.alert("로그인", "구글 로그인 페이지로 이동합니다.", [
            { text: "취소", style: "cancel" },
            {
              text: "이동",
              onPress: () => {
                Linking.openURL(googleOAuthUrl);
              },
            },
          ]);

          return { type: "cancel" };
        }

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
