// OAuth2 리디렉트 방식으로 변경되어 직접 API 호출이 불필요
// JWT 토큰은 백엔드에서 리디렉트로 전달됨

import AsyncStorage from "@react-native-async-storage/async-storage";

// 저장된 JWT 토큰 가져오기
export const getStoredToken = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt_token");
    if (token) {
      console.log("🔐 저장된 JWT 토큰:", token);
      console.log("📝 토큰 길이:", token.length);
      console.log("🔍 토큰 형식 확인:", token.substring(0, 20) + "...");
    } else {
      console.log("⚠️ 저장된 JWT 토큰이 없습니다");
    }
    return token;
  } catch (error) {
    console.error("❌ 토큰 가져오기 에러:", error);
    return null;
  }
};

// 저장된 JWT 토큰 제거 (로그아웃 시)
export const removeStoredToken = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt_token");
    if (token) {
      console.log("🗑️ 제거할 JWT 토큰:", token.substring(0, 20) + "...");
    }
    await AsyncStorage.removeItem("jwt_token");
    console.log("✅ JWT 토큰 제거 완료");
  } catch (error) {
    console.error("❌ 토큰 제거 에러:", error);
  }
};

// OAuth2 리디렉트 방식에서는 사용자 정보를 백엔드에서 처리
