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

// JWT 토큰이 유효한지 확인 (클라이언트 측 기본 검증)
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  try {
    // JWT 토큰 구조 확인 (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // payload 디코딩하여 만료 시간 확인
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp && payload.exp < currentTime) {
      console.log("⚠️ JWT 토큰이 만료되었습니다");
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ JWT 토큰 검증 에러:", error);
    return false;
  }
};

// 토큰에서 사용자 정보 추출
export const extractUserInfoFromToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return {
      email: payload.email,
      sub: payload.sub,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("❌ 토큰에서 사용자 정보 추출 에러:", error);
    return null;
  }
};

// 백엔드 API 호출을 위한 헤더 생성
export const createAuthHeaders = async () => {
  const token = await getStoredToken();
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// OAuth2 리디렉트 방식에서는 사용자 정보를 백엔드에서 처리
// 필요시 백엔드 API를 호출하여 사용자 정보를 가져올 수 있음
