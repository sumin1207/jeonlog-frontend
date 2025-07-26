// API 기본 설정
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://your-api-server.com/api";

// 서버 응답 타입
interface ApiResponse {
  success: boolean;
  message?: string;
}

// 회원 탈퇴 처리
export const deleteAccount = async (
  userId: string,
  accessToken?: string
): Promise<ApiResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 액세스 토큰이 있다면 헤더에 추가
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("회원 탈퇴 에러:", error);
    return {
      success: false,
      message: "회원 탈퇴 중 오류가 발생했습니다.",
    };
  }
};

// 사용자 데이터 삭제 (로컬)
export const clearLocalUserData = () => {
  console.log("로컬 사용자 데이터 삭제 완료");
};
