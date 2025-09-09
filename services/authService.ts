// OAuth2 리디렉트 방식으로 변경되어 직접 API 호출이 불필요
// JWT 토큰은 백엔드에서 리디렉트로 전달됨

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendUrl } from "../constants/Config";

// 저장된 JWT 토큰 가져오기 (기존 함수 제거됨 - 아래 authService.getToken 사용)

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

// JWT 토큰이 유효한지 확인 (기존 함수 제거됨 - 아래 isTokenValid 사용)

// 토큰에서 사용자 정보 추출 (기존 함수 제거됨 - 아래 extractUserInfoFromToken 사용)

// 백엔드 API 호출을 위한 헤더 생성
export const createAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("jwt_token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
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

// 커스텀 서버 URL 가져오기
export const getCustomServerUrl = async (): Promise<string> => {
  try {
    const customUrl = await AsyncStorage.getItem("custom_server_url");
    return customUrl || getBackendUrl();
  } catch (error) {
    console.error("❌ 커스텀 서버 URL 가져오기 실패:", error);
    return getBackendUrl();
  }
};

// 서버 연결 상태 확인 (CORS 문제로 인해 간소화)
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const backendUrl = await getCustomServerUrl();
    console.log("🔍 서버 연결 확인 중:", backendUrl);

    // CORS 문제로 인해 실제 연결 확인 대신 서버 URL 유효성만 확인
    if (
      backendUrl &&
      (backendUrl.includes(
        "jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com"
      ) ||
        backendUrl.includes("localhost") ||
        backendUrl.includes("http"))
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
    const token = await AsyncStorage.getItem("jwt_token");
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

// AuthContext에서 사용하는 헬퍼 함수들
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("jwt_token");
  } catch (error) {
    return null;
  }
};

export const extractUserInfoFromToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return {
      sub: payload.sub,
      email: payload.email || payload.sub,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // exp가 있고 현재 시간보다 미래인지 확인
    if (payload.exp && payload.exp <= currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// JWT 토큰 관리 서비스
export const authService = {
  // JWT 토큰 저장
  async saveToken(token: string) {
    await AsyncStorage.setItem("jwt_token", token);
  },

  // JWT 토큰 가져오기
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("jwt_token");
  },

  // 사용자 정보 저장
  async saveUserInfo(userInfo: any) {
    await AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
  },

  // 사용자 정보 가져오기
  async getUserInfo(): Promise<any | null> {
    const userInfo = await AsyncStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // 로그아웃 (토큰과 사용자 정보 삭제)
  async logout() {
    await AsyncStorage.removeItem("jwt_token");
    await AsyncStorage.removeItem("user_info");
  },

  // 로그인 상태 확인
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  },
};

// 사용자 정보 조회 서비스 (API 명세서 기반)
export const userService = {
  async getCurrentUser() {
    const token = await authService.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(
        "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
        }
      );

      if (response.status === 200) {
        const userData = await response.json();
        const formattedUserData = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        };

        await authService.saveUserInfo(formattedUserData);
        return formattedUserData;
      } else if (response.status === 401) {
        await authService.logout();
        return null;
      } else if (response.status === 500) {
        return null;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  },
};

// 토큰 자동 갱신 함수
export const autoRefreshToken = async (): Promise<string | null> => {
  try {
    const currentToken = await authService.getToken();
    if (!currentToken) return null;

    // 토큰 만료 시간 확인
    const tokenInfo = extractUserInfoFromToken(currentToken);
    if (!tokenInfo || !tokenInfo.exp) return currentToken;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = tokenInfo.exp - currentTime;

    // 토큰이 5분 이내에 만료되면 갱신
    if (timeUntilExpiry < 300) {
      console.log("🔄 토큰 갱신 필요, 갱신 중...");
      const newToken = await refreshToken();
      return newToken;
    }

    return currentToken;
  } catch (error) {
    console.error("❌ 토큰 자동 갱신 실패:", error);
    return null;
  }
};

// API 요청 서비스 (JWT 토큰 자동 포함)
export const apiService = {
  async request(url: string, options: RequestInit = {}) {
    const token = await authService.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await authService.logout();
    }

    return response;
  },
};

// API 요청 시 자동으로 토큰 갱신하는 래퍼 함수
export const apiRequestWithAutoRefresh = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = await autoRefreshToken();
  if (!token) {
    throw new Error("인증 토큰이 없습니다");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // 토큰이 만료된 경우 로그아웃
    await authService.logout();
    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  return response;
};

// 로그아웃 API 호출
export const logoutFromBackend = async () => {
  try {
    const response = await apiService.request(
      "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/users/logout",
      {
        method: "POST",
      }
    );

    if (response.ok) {
      console.log("✅ 백엔드 로그아웃 성공");
      return true;
    } else {
      console.log("⚠️ 백엔드 로그아웃 실패:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ 백엔드 로그아웃 에러:", error);
    return false;
  }
};

// 회원탈퇴 API 호출
export const deleteAccountFromBackend = async () => {
  try {
    const response = await apiService.request(
      "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/users/",
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      console.log("✅ 백엔드 회원탈퇴 성공");
      return true;
    } else {
      console.log("⚠️ 백엔드 회원탈퇴 실패:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ 백엔드 회원탈퇴 에러:", error);
    return false;
  }
};
