import { getBackendUrl } from "../constants/Config";
import { authService } from "./authService";

// 북마크 등록
export const addBookmark = async (exhibitionId: number) => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(
      `${getBackendUrl()}/api/exhibitions/${exhibitionId}/bookmarks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("❌ 북마크 등록 에러 응답:", errorData);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    console.log("🔍 북마크 등록 응답:", response.status);

    const data = await response.json();
    console.log("✅ 북마크 등록 성공:", data);
    return data;
  } catch (error) {
    console.error("❌ 북마크 등록 에러:", error);
    throw error;
  }
};

// 북마크 취소
export const removeBookmark = async (exhibitionId: number) => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(
      `${getBackendUrl()}/api/exhibitions/${exhibitionId}/bookmark`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("❌ 북마크 취소 에러 응답:", errorData);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("✅ 북마크 취소 성공:", data);
    return data;
  } catch (error) {
    console.error("❌ 북마크 취소 에러:", error);
    throw error;
  }
};

// 북마크 목록 조회
export const getBookmarks = async () => {
  try {
    const token = await authService.getToken();
    console.log(
      "🔑 북마크 조회 - 토큰 확인:",
      token ? "토큰 있음" : "토큰 없음"
    );

    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const url = `${getBackendUrl()}/api/users/bookmarks`;
    console.log("🌐 북마크 조회 API URL:", url);
    console.log(
      "🔑 Authorization 헤더:",
      `Bearer ${token.substring(0, 20)}...`
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "📡 북마크 조회 응답 상태:",
      response.status,
      response.statusText
    );

    if (response.status === 401) {
      console.log("⚠️ 인증 실패 - 토큰이 유효하지 않음");
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("❌ 북마크 목록 조회 에러 응답:", errorData);
      console.log("❌ 응답 상태:", response.status, response.statusText);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("✅ 북마크 목록 조회 성공:", data);
    console.log(
      "📊 북마크 개수:",
      Array.isArray(data) ? data.length : "데이터가 배열이 아님"
    );
    return data;
  } catch (error) {
    console.error("❌ 북마크 목록 조회 에러:", error);
    console.error("❌ 에러 타입:", typeof error);
    console.error(
      "❌ 에러 메시지:",
      error instanceof Error ? error.message : String(error)
    );

    throw error;
  }
};

// 여러 URL 테스트 함수 (토큰 포함)
export const testMultipleUrls = async () => {
  const token = await authService.getToken();
  if (!token) {
    console.log("❌ 토큰이 없어서 URL 테스트를 할 수 없습니다.");
    return { success: false, error: "토큰이 없습니다" };
  }

  const testUrls = [
    "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/users/bookmarks",
    "https://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/users/bookmarks",
    "http://localhost:8080/api/users/bookmarks",
    "https://localhost:8080/api/users/bookmarks",
  ];

  console.log("🧪 여러 URL 테스트 시작 (토큰 포함)");
  console.log("🔑 사용할 토큰:", token.substring(0, 20) + "...");

  for (const url of testUrls) {
    try {
      console.log(`🔍 테스트 중: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(
        `📡 ${url} - 상태: ${response.status} ${response.statusText}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${url} - 성공! 데이터:`, data);
        return { success: true, workingUrl: url, data };
      } else if (response.status === 401) {
        console.log(`🔐 ${url} - 인증 실패 (401)`);
      } else {
        console.log(`❌ ${url} - 실패 (${response.status})`);
      }
    } catch (error) {
      console.log(
        `❌ ${url} - 연결 에러: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return { success: false, error: "모든 URL 테스트 실패" };
};

// API 연결 테스트 함수 (토큰 포함)
export const testApiConnection = async () => {
  try {
    const token = await authService.getToken();
    if (!token) {
      console.log("❌ 토큰이 없어서 API 테스트를 할 수 없습니다.");
      return { success: false, error: "토큰이 없습니다" };
    }

    const url = `${getBackendUrl()}/api/users/bookmarks`;
    console.log("🧪 API 연결 테스트 시작 (토큰 포함)");
    console.log("🌐 테스트 URL:", url);
    console.log("🔑 사용할 토큰:", token.substring(0, 20) + "...");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📡 테스트 응답 상태:", response.status, response.statusText);
    console.log(
      "📡 테스트 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API 연결 테스트 성공:", data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log("❌ API 연결 테스트 실패:", errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error("❌ API 연결 테스트 에러:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// 토큰 상태 확인 함수
export const checkTokenStatus = async () => {
  try {
    const token = await authService.getToken();
    console.log("🔑 토큰 상태 확인:");
    console.log("  - 토큰 존재:", !!token);
    if (token) {
      console.log("  - 토큰 길이:", token.length);
      console.log("  - 토큰 시작:", token.substring(0, 20) + "...");

      // JWT 토큰 유효성 검증
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("  - 토큰 페이로드:", payload);
          console.log("  - 만료 시간:", new Date(payload.exp * 1000));
          console.log("  - 현재 시간:", new Date());
          console.log("  - 토큰 만료됨:", payload.exp < Date.now() / 1000);
        }
      } catch (e) {
        console.log("  - 토큰 파싱 실패:", e);
      }
    }
    return { hasToken: !!token, token };
  } catch (error) {
    console.error("❌ 토큰 상태 확인 에러:", error);
    return { hasToken: false, token: null, error };
  }
};

// 북마크 서비스 객체
export const bookmarkService = {
  addBookmark,
  removeBookmark,
  getBookmarks,
  testApiConnection,
  testMultipleUrls,
  checkTokenStatus,
};
