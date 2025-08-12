import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    extra: {
      EXPO_NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
      EXPO_NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
      EXPO_GOOGLE_CLIENT_ID:
        process.env.EXPO_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
      EXPO_GOOGLE_CLIENT_SECRET:
        process.env.EXPO_GOOGLE_CLIENT_SECRET ||
        process.env.GOOGLE_CLIENT_SECRET,
      EXPO_KAKAO_MAP_API_KEY: process.env.KAKAO_MAP_API_KEY,
    },
  };
};
