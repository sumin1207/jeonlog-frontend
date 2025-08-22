// 프로젝트 전체 타이포그래피 시스템
export const Typography = {
  // 폰트 크기
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22,
    xxxl: 24,
    display: 32,
  },

  // 폰트 굵기
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // 라인 높이
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // 텍스트 스타일
  text: {
    h1: {
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 24,
      fontWeight: "600",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: 18,
      fontWeight: "500",
      lineHeight: 1.4,
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 1.6,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 1.4,
    },
    button: {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 1.4,
    },
  },
} as const;

export type TypographyKey = keyof typeof Typography;
export type TypographyValue = (typeof Typography)[TypographyKey];
