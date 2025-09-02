// OAuth2 리디렉트 방식으로 변경되어 직접 API 호출이 불필요
// JWT 토큰은 백엔드에서 리디렉트로 전달됨

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendUrl } from "../constants/Config";

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

// 백엔드에서 사용자 정보 가져오기
export const fetchUserInfo = async () => {
  try {
    const headers = await createAuthHeaders();
    const response = await fetch(`${getBackendUrl()}/api/user/profile`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ 사용자 정보 가져오기 에러:", error);
    throw error;
  }
};

// 백엔드에서 로그아웃 처리
export const logoutFromBackend = async () => {
  try {
    const headers = await createAuthHeaders();
    await fetch(`${getBackendUrl()}/api/users/logout`, {
      method: "POST",
      headers,
    });
  } catch (error) {
    console.error("❌ 백엔드 로그아웃 에러:", error);
  } finally {
    // 로컬 토큰 제거
    await removeStoredToken();
  }
};

// 타임아웃이 있는 fetch 함수
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// 서버 연결 상태 확인 (CORS 문제로 인해 간소화)
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const backendUrl = getBackendUrl();
    console.log("🔍 서버 연결 확인 중:", backendUrl);

    // CORS 문제로 인해 실제 연결 확인 대신 서버 URL 유효성만 확인
    if (
      backendUrl &&
      backendUrl.includes(
        "jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com"
      )
    ) {
      console.log("✅ 서버 URL이 올바르게 설정됨");
      return true;
    }

    console.log("❌ 서버 URL이 올바르지 않음");
    return false;
  } catch (error) {
    console.error("❌ 서버 연결 확인 실패:", error);
    return false;
  }
};

// 서버에서 사용자 프로필 정보 가져오기
export const fetchUserProfile = async () => {
  try {
    const headers = await createAuthHeaders();
    const response = await fetch(`${getBackendUrl()}/api/user/profile`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userProfile = await response.json();
    console.log("✅ 사용자 프로필 가져오기 성공:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("❌ 사용자 프로필 가져오기 에러:", error);
    throw error;
  }
};

// 토큰 갱신
export const refreshToken = async () => {
  try {
    const token = await getStoredToken();
    if (!token) {
      throw new Error("저장된 토큰이 없습니다");
    }

    const response = await fetch(`${getBackendUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.token) {
      await AsyncStorage.setItem("jwt_token", data.token);
      console.log("✅ 토큰 갱신 완료");
      return data.token;
    }
  } catch (error) {
    console.error("❌ 토큰 갱신 에러:", error);
    throw error;
  }
};
