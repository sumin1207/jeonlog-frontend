import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendUrl } from "../constants/Config";
import { createAuthHeaders } from "./authService";

// 북마크 등록
export const addBookmark = async (exhibitionId: number) => {
  try {
    const token = await AsyncStorage.getItem("jwt_token");
    const headers = await createAuthHeaders();
    const response = await fetch(
      `${getBackendUrl()}/api/exhibitions/${exhibitionId}/bookmarks`,
      {
        method: "POST",
        headers: {
          ...headers,
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
    console.log("📊 북마크 등록 응답 헤더:", response.headers);

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
    const token = await AsyncStorage.getItem("jwt_token");
    const headers = await createAuthHeaders();
    const response = await fetch(
      `${getBackendUrl()}/api/exhibitions/${exhibitionId}/bookmark`,
      {
        method: "DELETE",
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("🔍 북마크 취소 응답:", response.status);
    console.log("📊 북마크 취소 응답 헤더:", response.headers);

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
    const token = await AsyncStorage.getItem("jwt_token");
    const headers = await createAuthHeaders();
    const response = await fetch(`${getBackendUrl()}/api/users/bookmarks`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    console.log("🔍 북마크 목록 조회 응답:", response.status);
    console.log("📊 북마크 목록 조회 응답 헤더:", response.headers);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("❌ 북마크 목록 조회 에러 응답:", errorData);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("✅ 북마크 목록 조회 성공:", data);
    return data;
  } catch (error) {
    console.error("❌ 북마크 목록 조회 에러:", error);
    throw error;
  }
};

// 북마크 서비스 객체
export const bookmarkService = {
  addBookmark,
  removeBookmark,
  getBookmarks,
};
