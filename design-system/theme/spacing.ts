// 프로젝트 전체 간격 시스템
export const Spacing = {
  // 기본 간격 단위 (4px 기준)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,

  // 특정 간격
  screenPadding: 20,
  cardPadding: 16,
  buttonPadding: {
    horizontal: 16,
    vertical: 8,
  },
  inputPadding: {
    horizontal: 12,
    vertical: 8,
  },

  // 마진
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  // 패딩
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  // 간격
  gap: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
} as const;

export type SpacingKey = keyof typeof Spacing;
export type SpacingValue = (typeof Spacing)[SpacingKey];
