import { getBackendUrl } from "../constants/Config";
import { createAuthHeaders } from "./authService";

// API 기본 URL
const API_BASE_URL = getBackendUrl();

export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
}

export interface FollowResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class FollowService {
  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    body?: any
  ): Promise<FollowResponse> {
    try {
      const headers = await createAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("API 요청 실패:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  // 팔로워 목록 가져오기
  async getFollowers(): Promise<FollowResponse> {
    return this.makeRequest("/api/profile/followers");
  }

  // 팔로잉 목록 가져오기
  async getFollowing(): Promise<FollowResponse> {
    return this.makeRequest("/api/profile/followings");
  }

  // 사용자 팔로우하기
  async followUser(targetId: string): Promise<FollowResponse> {
    return this.makeRequest(`/api/profile/${targetId}/follow`, "POST");
  }

  // 사용자 언팔로우하기
  async unfollowUser(targetId: string): Promise<FollowResponse> {
    return this.makeRequest(`/api/profile/${targetId}/unfollow`, "DELETE");
  }

  // 팔로우 상태 확인
  async checkFollowStatus(targetId: string): Promise<FollowResponse> {
    return this.makeRequest(`/api/profile/${targetId}/follow-status`);
  }
}

export const followService = new FollowService();
