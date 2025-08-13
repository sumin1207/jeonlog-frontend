import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getStoredToken,
  extractUserInfoFromToken,
  isTokenValid,
} from "../../services/authService";

// 사용자 정보 타입 정의
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  loginType: "google" | "naver";
  accessToken?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 토큰 확인하여 자동 로그인
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 AuthContext: 저장된 토큰 확인 시작");

        const token = await getStoredToken();
        console.log("🔍 AuthContext: 저장된 토큰:", token ? "있음" : "없음");

        if (token) {
          console.log("🔍 AuthContext: 토큰 길이:", token.length);
          console.log(
            "🔍 AuthContext: 토큰 일부:",
            token.substring(0, 50) + "..."
          );

          const isValid = isTokenValid(token);
          console.log("🔍 AuthContext: 토큰 유효성:", isValid);

          if (isValid) {
            // 토큰에서 사용자 정보 추출
            const userInfoFromToken = extractUserInfoFromToken(token);
            console.log(
              "🔍 AuthContext: 토큰에서 추출한 사용자 정보:",
              userInfoFromToken
            );

            if (userInfoFromToken) {
              const user: UserInfo = {
                id: userInfoFromToken.sub || "unknown",
                name: userInfoFromToken.email?.split("@")[0] || "사용자",
                email: userInfoFromToken.email || "unknown@example.com",
                loginType: "google", // 기본값, 필요시 수정
                accessToken: token,
              };

              console.log("🔍 AuthContext: 생성된 사용자 정보:", user);
              setUserInfo(user);
              setIsLoggedIn(true);
              console.log("✅ 저장된 토큰으로 자동 로그인 완료:", user.email);
            } else {
              console.log("⚠️ 토큰에서 사용자 정보 추출 실패");
              setIsLoggedIn(false);
            }
          } else {
            console.log("⚠️ 토큰이 유효하지 않음");
            setIsLoggedIn(false);
          }
        } else {
          console.log("ℹ️ 저장된 토큰이 없음");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("❌ 토큰 확인 중 에러:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
        console.log("🔍 AuthContext: 로딩 완료, 최종 로그인 상태:", isLoggedIn);
      }
    };

    checkStoredToken();
  }, []);

  const login = (user: UserInfo) => {
    setUserInfo(user);
    setIsLoggedIn(true);
    console.log("🔐 로그인 완료:", user.email);
  };

  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    console.log("🚪 로그아웃 완료");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userInfo,
        setUserInfo,
        login,
        logout,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
