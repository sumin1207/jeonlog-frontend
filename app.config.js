import "dotenv/config";

console.log('Naver Client ID from .env:', process.env.NAVER_CLIENT_ID);

export default ({ config }) => {
  return {
    ...config,
    extra: {
      EXPO_NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
      EXPO_NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
      EXPO_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      EXPO_GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
  };
};
