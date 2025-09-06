import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,

    // Android 설정
    android: {
      ...config.android,
      package: "com.jeonlog.jeonlog",
      icon: "./assets/images/mainIcon.png",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      // 알림 기능을 위한 권한들
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.VIBRATE",
        "android.permission.WAKE_LOCK",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.POST_NOTIFICATIONS",
      ],
    },

    // iOS 설정
    ios: {
      ...config.ios,
      supportsTablet: true,
    },

    // 스플래시 화면
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    // 플러그인들
    plugins: [
      "expo-router",
      "expo-web-browser",
      [
        "expo-notifications",
        {
          icon: "./assets/images/mainIcon.png",
          color: "#ffffff",
          defaultChannel: "default",
        },
      ],
      [
        "@react-native-seoul/naver-login",
        {
          kConsumerKey: "y1Hp9eqM11WwuL5rhdfn",
          kConsumerSecret: "rnIV0twBdr",
          kServiceAppName: "전록",
          kServiceAppUrlScheme: "com.jeonlog.jeonlog",
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.565177569555-np7c056iomm3dno1k32lpqskorkmld6n",
        },
      ],
    ],

    // 환경 변수들
    extra: {
      EXPO_NAVER_CLIENT_ID:
        process.env.EXPO_NAVER_CLIENT_ID || "y1Hp9eqM11WwuL5rhdfn",
      EXPO_NAVER_CLIENT_SECRET:
        process.env.EXPO_NAVER_CLIENT_SECRET || "rnIV0twBdr",
      EXPO_GOOGLE_CLIENT_ID:
        process.env.EXPO_GOOGLE_CLIENT_ID ||
        "565177569555-np7c056iomm3dno1k32lpqskorkmld6n.apps.googleusercontent.com",
      EXPO_NAVER_MAP_API_KEY:
        process.env.EXPO_NAVER_MAP_API_KEY || "dhvkt5hnea",
      EXPO_BACKEND_URL:
        process.env.EXPO_BACKEND_URL ||
        "https://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com",
      EXPO_PUBLIC_NGROK_URL:
        process.env.EXPO_PUBLIC_NGROK_URL || "http://localhost:8081",
      eas: {
        projectId: "9b83d693-796f-49c3-a2be-63cfc53d2763",
      },
    },
  };
};
