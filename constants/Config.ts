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
  const extra = Constants.expoConfig?.extra;

  // NAVER_CLIENT_ID를 네이버맵 API 키로 사용
  const apiKey = extra?.EXPO_NAVER_CLIENT_ID;

  return apiKey || "";
};

// 백엔드 서버 URL 가져오기
export const getBackendUrl = (): string => {
  // CORS 문제 해결을 위해 HTTPS 사용 시도
  const backendUrl =
    "https://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com";

  return backendUrl;
};

// 환경변수 로딩 상태 확인
export const isConfigLoaded = (): boolean => {
  const extra = Constants.expoConfig?.extra;
  return !!extra?.EXPO_NAVER_CLIENT_ID;
};
