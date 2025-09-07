import { authService } from "./authService";
import { getBackendUrl } from "../constants/Config";

// 방문 완료 전시 목록 타입 정의
export interface VisitedExhibition {
  id: number;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  posterUrl: string;
}

// 전시 방문 기록 요청 타입 정의
export interface VisitExhibitionRequest {
  visitedAt?: string; // ISO 8601 형식의 날짜시간 문자열
}

// 전시 방문 기록 응답 타입 정의
export interface VisitExhibitionResponse {
  message: string;
}

// 사용자 관련 유틸리티 함수들
export const clearLocalUserData = () => {
  console.log("로컬 사용자 데이터 삭제 완료");
};

// 방문 완료 전시 목록 조회 API
export const getVisitedExhibitions = async (): Promise<VisitedExhibition[]> => {
  console.log("🔍 getVisitedExhibitions 함수 호출됨");
  try {
    const token = await authService.getToken();
    console.log("🔑 토큰 확인:", token ? "토큰 있음" : "토큰 없음");
    if (!token) {
      throw new Error("인증 토큰이 없습니다");
    }

    const url = `${getBackendUrl()}/api/users/visits`;
    console.log("🌐 API 호출 URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📡 API 응답 받음:", response.status, response.statusText);

    if (response.ok) {
      const visitedExhibitions = await response.json();
      console.log("✅ 방문 완료 전시 목록 조회 성공:", visitedExhibitions);
      return visitedExhibitions;
    } else if (response.status === 401) {
      console.log("⚠️ 인증 실패 - 토큰이 없거나 만료됨");
      console.log("응답 상태 코드:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      try {
        const errorBody = await response.text();
        console.log("에러 응답 본문:", errorBody);
      } catch (e) {
        console.log("에러 응답 본문 읽기 실패:", e);
      }
      throw new Error("인증이 필요합니다");
    } else if (response.status === 500) {
      console.log("⚠️ 서버 오류");
      console.log("응답 상태 코드:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      try {
        const errorBody = await response.text();
        console.log("에러 응답 본문:", errorBody);
      } catch (e) {
        console.log("에러 응답 본문 읽기 실패:", e);
      }
      throw new Error("서버 오류가 발생했습니다");
    } else {
      console.log("⚠️ 방문 완료 전시 목록 조회 실패:", response.status);
      console.log("응답 상태 코드:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      try {
        const errorBody = await response.text();
        console.log("에러 응답 본문:", errorBody);
      } catch (e) {
        console.log("에러 응답 본문 읽기 실패:", e);
      }
      throw new Error(
        `방문 완료 전시 목록을 가져올 수 없습니다 (상태 코드: ${response.status})`
      );
    }
  } catch (error) {
    console.error("❌ 방문 완료 전시 목록 조회 에러:", error);

    // 에러 발생 시 빈 배열 반환
    return [];
  }
};

// 전시 방문 기록 저장 API
export const visitExhibition = async (
  exhibitionId: number,
  requestData?: VisitExhibitionRequest
): Promise<VisitExhibitionResponse> => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("인증 토큰이 없습니다");
    }

    const response = await fetch(
      `${getBackendUrl()}/api/exhibitions/${exhibitionId}/visits`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: requestData ? JSON.stringify(requestData) : undefined,
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ 전시 방문 기록 저장 성공:", result);
      return result;
    } else if (response.status === 401) {
      console.log("⚠️ 인증 실패 - 토큰이 없거나 만료됨");
      console.log("응답 상태 코드:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      try {
        const errorBody = await response.text();
        console.log("에러 응답 본문:", errorBody);
      } catch (e) {
        console.log("에러 응답 본문 읽기 실패:", e);
      }
      throw new Error("인증이 필요합니다");
    } else if (response.status === 404) {
      console.log("⚠️ 전시를 찾을 수 없음");
      console.log("응답 상태 코드:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      try {
        const errorBody = await response.text();
        console.log("에러 응답 본문:", errorBody);
      } catch (e) {
        console.log("에러 응답 본문 읽기 실패:", e);
      }
      throw new Error("해당 전시를 찾을 수 없습니다");
    } else if (response.status === 500) {
      console.log("⚠️ 서버 오류");
      console.log("응답 상태 코드:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      try {
        const errorBody = await response.text();
        console.log("에러 응답 본문:", errorBody);
      } catch (e) {
        console.log("에러 응답 본문 읽기 실패:", e);
      }
      throw new Error("서버 오류가 발생했습니다");
    } else {
      console.log("⚠️ 전시 방문 기록 저장 실패:", response.status);
      console.log("응답 상태 코드:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      try {
        const errorBody = await response.text();
        console.log("에러 응답 본문:", errorBody);
      } catch (e) {
        console.log("에러 응답 본문 읽기 실패:", e);
      }
      throw new Error(
        `전시 방문 기록을 저장할 수 없습니다 (상태 코드: ${response.status})`
      );
    }
  } catch (error) {
    console.error("❌ 전시 방문 기록 저장 에러:", error);

    // 네트워크 에러 상세 로깅
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      console.log("🌐 네트워크 연결 실패 - 서버에 연결할 수 없습니다");
      console.log(
        "🔗 시도한 URL:",
        `${getBackendUrl()}/api/exhibitions/${exhibitionId}/visits`
      );
      console.log("💡 가능한 원인:");
      console.log("  - 서버가 다운되었거나");
      console.log("  - 네트워크 연결 문제 또는");
      console.log("  - CORS 설정 문제");
    } else {
      console.log("🔍 기타 에러:", error);
    }

    throw error;
  }
};

// 전시 방문 기록 저장 헬퍼 함수 (현재 시간으로 자동 설정)
export const markExhibitionAsVisited = async (
  exhibitionId: number
): Promise<boolean> => {
  try {
    await visitExhibition(exhibitionId);
    return true;
  } catch (error) {
    console.error("❌ 전시 방문 기록 저장 실패:", error);
    return false;
  }
};

// 전시 방문 기록 저장 헬퍼 함수 (특정 시간 지정)
export const markExhibitionAsVisitedAt = async (
  exhibitionId: number,
  visitedAt: Date
): Promise<boolean> => {
  try {
    const requestData: VisitExhibitionRequest = {
      visitedAt: visitedAt.toISOString(),
    };
    await visitExhibition(exhibitionId, requestData);
    return true;
  } catch (error) {
    console.error("❌ 전시 방문 기록 저장 실패:", error);
    return false;
  }
};
