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
      // 딥링크를 위한 intent filters
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "jeonlog.app",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
        {
          action: "VIEW",
          data: [
            {
              scheme: "com.jeonlog.jeonlog",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    // iOS 설정
    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: "com.jeonlog.jeonlog",
      // 딥링크를 위한 URL schemes
      associatedDomains: ["applinks:jeonlog.app"],
    },

    // 딥링크 스키마 설정
    scheme: "com.jeonlog.jeonlog",

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
