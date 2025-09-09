import { getBackendUrl } from "../constants/Config";
import { authService } from "./authService";

// 나를 위한 전시 추천
export const getRecommendation = async () => {
  const token = await authService.getToken();
  const response = await fetch(`${getBackendUrl()}/api/recommendations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 요즘 뜨고 있는 전시
export const getPopularRecommendations = async () => {
  const token = await authService.getToken();
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
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 나이별 추천
export const getAgeRecommendations = async () => {
  const token = await authService.getToken();
  const response = await fetch(`${getBackendUrl()}/api/recommendations/age`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 성별별 추천
export const getGenderRecommendations = async () => {
  const token = await authService.getToken();
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
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
