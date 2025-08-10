import Constants from "expo-constants";

// 환경변수에서 API 키들을 가져오는 함수
export const getApiKeys = () => {
  const extra = Constants.expoConfig?.extra;

  return {
    kakaoMapApiKey:
      extra?.EXPO_KAKAO_MAP_API_KEY || "a7ab05f1d83e3784d588c7fa3de90851", // 기본값으로 fallback
    naverClientId: extra?.EXPO_NAVER_CLIENT_ID,
    naverClientSecret: extra?.EXPO_NAVER_CLIENT_SECRET,
    googleClientId: extra?.EXPO_GOOGLE_CLIENT_ID,
    googleClientSecret: extra?.EXPO_GOOGLE_CLIENT_SECRET,
  };
};

// 카카오맵 API 키만 가져오는 함수
export const getKakaoMapApiKey = (): string => {
  return getApiKeys().kakaoMapApiKey;
};

// 환경변수 로딩 상태 확인
export const isConfigLoaded = (): boolean => {
  const extra = Constants.expoConfig?.extra;
  return !!extra?.EXPO_KAKAO_MAP_API_KEY;
};
