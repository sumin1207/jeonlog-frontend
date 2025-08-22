// 프로젝트 전체 테두리 반경 시스템
export const BorderRadius = {
  // 기본 테두리 반경
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,

  // 특정 컴포넌트용
  button: {
    small: 8,
    medium: 16,
    large: 20,
    pill: 9999,
  },

  card: {
    small: 8,
    medium: 12,
    large: 16,
  },

  input: {
    small: 4,
    medium: 8,
    large: 12,
  },

  avatar: {
    small: 20,
    medium: 24,
    large: 32,
    round: 9999,
  },
} as const;

export type BorderRadiusKey = keyof typeof BorderRadius;
export type BorderRadiusValue = (typeof BorderRadius)[BorderRadiusKey];
