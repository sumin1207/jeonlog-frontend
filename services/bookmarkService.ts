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
      throw new Error(
        errorData.message || "북마크 등록에 실패했습니다. 다시 시도해주세요."
      );
    }
    const data = await response.json();
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
      throw new Error(
        errorData.message || "북마크 취소에 실패했습니다. 다시 시도해주세요."
      );
    }

    const data = await response.json();
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
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(`${getBackendUrl()}/api/users/bookmarks`, {
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
          "북마크 목록을 불러오는데 실패했습니다. 다시 시도해주세요."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ 북마크 목록 조회 에러:", error);
    throw error;
  }
};

// 북마크 개수
export const getBookmarkCount = async (exhibitionId: number) => {
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await fetch(
      `${getBackendUrl()}/api/exhibitions/${exhibitionId}/bookmarks/count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          "북마크 개수를 불러오는데 실패했습니다. 다시 시도해주세요."
      );
    }

    return response.json();
  } catch (error) {
    console.error("❌ 북마크 개수 조회 에러:", error);
    throw error;
  }
};

// 북마크 서비스 객체
export const bookmarkService = {
  addBookmark,
  removeBookmark,
  getBookmarks,
  getBookmarkCount,
};
