import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const searchService = axios.create({
  baseURL:
    "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 전체 전시 목록 조회 (JWT 토큰 포함)
export const getAllExhibitions = async () => {
  const url = `http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/exhibitions`;

  try {
    console.log("🔍 전체 전시 목록 API 요청 URL:", url);

    // JWT 토큰 가져오기
    const token = await AsyncStorage.getItem("jwt_token");
    console.log("🔑 JWT 토큰 존재 여부:", !!token);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // JWT 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("🔑 JWT 토큰 추가됨");
    } else {
      console.log("⚠️ JWT 토큰이 없습니다");
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      mode: "cors",
    });

    console.log("🔍 전체 전시 목록 API 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 전체 전시 목록 API 오류 응답:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔍 전체 전시 목록 API 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ 전체 전시 목록 API 오류:", error);
    throw error;
  }
};

export const searchExhibitions = async (
  query: string,
  options?: {
    filter?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
  }
) => {
  // 백엔드 코드에 맞춰 filter를 배열로 처리
  const filterArray = options?.filter ? options.filter.split(",") : undefined;

  const params = new URLSearchParams({
    query: query,
  });

  // filter 배열을 각각 추가
  if (filterArray) {
    filterArray.forEach((filter) => {
      params.append("filter", filter);
    });
  }

  const url = `http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/api/exhibitions/search?${params.toString()}`;

  try {
    console.log("🔍 검색 API 요청 URL:", url);
    console.log("🔍 검색 파라미터:", { query, filter: filterArray });

    // JWT 토큰 가져오기
    const token = await AsyncStorage.getItem("jwt_token");
    console.log("🔑 JWT 토큰 존재 여부:", !!token);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // JWT 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("🔑 JWT 토큰 추가됨");
    } else {
      console.log("⚠️ JWT 토큰이 없습니다");
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      mode: "cors",
    });

    console.log("🔍 검색 API 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 검색 API 오류 응답:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔍 검색 API 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ 검색 API 오류:", error);
    throw error;
  }
};

export default searchService;
