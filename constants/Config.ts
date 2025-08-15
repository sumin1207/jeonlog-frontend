import Constants from "expo-constants";

// 환경변수에서 API 키들을 가져오는 함수
export const getApiKeys = () => {
  const extra = Constants.expoConfig?.extra;

  return {
    naverClientId: extra?.EXPO_NAVER_CLIENT_ID,
    naverClientSecret: extra?.EXPO_NAVER_CLIENT_SECRET,
    googleClientId: extra?.EXPO_GOOGLE_CLIENT_ID,
    googleClientSecret: extra?.EXPO_GOOGLE_CLIENT_SECRET,
  };
};

// 네이버맵 API 키만 가져오는 함수
export const getNaverMapApiKey = (): string => {
  console.log("🔍 getNaverMapApiKey 함수 호출됨");

  const extra = Constants.expoConfig?.extra;
  console.log("🔍 Constants.expoConfig?.extra:", extra);

  // NAVER_CLIENT_ID를 네이버맵 API 키로 사용
  const apiKey = extra?.EXPO_NAVER_CLIENT_ID;
  console.log("🔍 EXPO_NAVER_CLIENT_ID:", apiKey);

  if (!apiKey) {
    console.warn(
      "⚠️ 네이버맵 API 키가 설정되지 않았습니다. .env 파일에 NAVER_CLIENT_ID를 설정해주세요."
    );
    console.log("🔍 환경변수 확인:");
    console.log(
      "  - process.env.NAVER_CLIENT_ID:",
      process.env.NAVER_CLIENT_ID
    );
    console.log(
      "  - process.env.EXPO_NAVER_CLIENT_ID:",
      process.env.EXPO_NAVER_CLIENT_ID
    );
  } else {
    console.log("✅ API 키 로드 성공:", apiKey.substring(0, 8) + "...");
  }

  return apiKey || "";
};

// 백엔드 서버 URL 가져오기
export const getBackendUrl = (): string => {
  const extra = Constants.expoConfig?.extra;
  const backendUrl = extra?.EXPO_BACKEND_URL || "http://localhost:3000";

  console.log("🔗 백엔드 서버 URL:", backendUrl);
  return backendUrl;
};

// 환경변수 로딩 상태 확인
export const isConfigLoaded = (): boolean => {
  const extra = Constants.expoConfig?.extra;
  return !!extra?.EXPO_NAVER_CLIENT_ID;
};
