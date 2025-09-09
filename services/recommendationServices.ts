import { getBackendUrl } from "../constants/Config";
import { authService } from "./authService";

// 나를 위한 전시 추천
export const getRecommendation = async () => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(`${getBackendUrl()}/api/recommendations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          "개인 추천을 불러오는데 실패했습니다. 다시 시도해주세요."
      );
    }

    return response.json();
  } catch (error) {
    console.error("❌ 개인 추천 조회 에러:", error);
    throw error;
  }
};

// 요즘 뜨고 있는 전시
export const getPopularRecommendations = async () => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(
      `${getBackendUrl()}/api/recommendations/popular`,
      {
        method: "GET",
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
      throw new Error(
        errorData.message ||
          "인기 전시를 불러오는데 실패했습니다. 다시 시도해주세요."
      );
    }

    return response.json();
  } catch (error) {
    console.error("❌ 인기 전시 조회 에러:", error);
    throw error;
  }
};

// 나이별 추천
export const getAgeRecommendations = async () => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(`${getBackendUrl()}/api/recommendations/age`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          "나이별 추천을 불러오는데 실패했습니다. 다시 시도해주세요."
      );
    }

    return response.json();
  } catch (error) {
    console.error("❌ 나이별 추천 조회 에러:", error);
    throw error;
  }
};

// 성별별 추천
export const getGenderRecommendations = async () => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(
      `${getBackendUrl()}/api/recommendations/gender`,
      {
        method: "GET",
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
      throw new Error(
        errorData.message ||
          "성별별 추천을 불러오는데 실패했습니다. 다시 시도해주세요."
      );
    }

    return response.json();
  } catch (error) {
    console.error("❌ 성별별 추천 조회 에러:", error);
    throw error;
  }
};
