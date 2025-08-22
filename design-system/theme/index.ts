// 테마 시스템 통합 인덱스
export * from "./colors";
export * from "./spacing";
export * from "./typography";
export * from "./borderRadius";
export * from "./shadows";

// 테마 타입 정의
export type Theme = "light" | "dark";

// 테마별 색상 매핑
export const getThemeColors = (theme: Theme) => {
  return {
    background: theme === "dark" ? "#1a1a1a" : "#ffffff",
    surface: theme === "dark" ? "#2a2a2a" : "#ffffff",
    text: {
      primary: theme === "dark" ? "#ffffff" : "#000000",
      secondary: theme === "dark" ? "#cccccc" : "#666666",
      disabled: theme === "dark" ? "#666666" : "#9e9e9e",
    },
    border: theme === "dark" ? "#333333" : "#dddddd",
  };
};
