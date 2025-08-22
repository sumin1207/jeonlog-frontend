// 프로젝트 전체 색상 시스템
export const Colors = {
  // 브랜드 컬러
  primary: {
    main: "#1c3519",
    light: "#2a4f26",
    dark: "#142814",
    contrast: "#ffffff",
  },

  // 보조 컬러
  secondary: {
    main: "#4CAF50",
    light: "#66BB6A",
    dark: "#388E3C",
    contrast: "#ffffff",
  },

  // 중성 컬러
  neutral: {
    white: "#ffffff",
    black: "#000000",
    gray50: "#fafafa",
    gray100: "#f5f5f5",
    gray200: "#eeeeee",
    gray300: "#e0e0e0",
    gray400: "#bdbdbd",
    gray500: "#9e9e9e",
    gray600: "#757575",
    gray700: "#616161",
    gray800: "#424242",
    gray900: "#212121",
  },

  // 상태 컬러
  status: {
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
  },

  // 배경 컬러
  background: {
    light: "#ffffff",
    dark: "#1a1a1a",
    card: "#ffffff",
    cardDark: "#2a2a2a",
  },

  // 텍스트 컬러
  text: {
    primary: "#000000",
    secondary: "#666666",
    disabled: "#9e9e9e",
    inverse: "#ffffff",
    dark: {
      primary: "#ffffff",
      secondary: "#cccccc",
      disabled: "#666666",
    },
  },

  // 테두리 컬러
  border: {
    light: "#dddddd",
    dark: "#333333",
    focus: "#1c3519",
  },

  // 그림자 컬러
  shadow: {
    light: "rgba(0, 0, 0, 0.1)",
    dark: "rgba(0, 0, 0, 0.3)",
  },
} as const;

export type ColorKey = keyof typeof Colors;
export type ColorValue = (typeof Colors)[ColorKey];
