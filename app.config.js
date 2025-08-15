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
      EXPO_NAVER_MAP_API_KEY: process.env.NAVER_CLIENT_ID, // 네이버맵은 NAVER_CLIENT_ID 사용
      EXPO_BACKEND_URL: process.env.EXPO_BACKEND_URL || "http://localhost:3000",
    },
  };
};
