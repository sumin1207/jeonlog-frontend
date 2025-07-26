import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const login = (user: UserInfo) => {
    setUserInfo(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
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
