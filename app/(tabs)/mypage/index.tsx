import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "../../../components/ui/TopBar";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { clearLocalUserData } from "../../../services/userService";
import { removeStoredToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 임시 회원탈퇴 함수 (나중에 실제 구현으로 교체)
const deleteAccount = async (userId: string, accessToken?: string) => {
  return { success: true, message: "회원탈퇴 완료" };
};

export default function MyPageScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn, logout, userInfo, isLoading } = useAuth();
  const { BookmarkedExhibitions, thumbsUpExhibitions } = useExhibition();
  const [visitedCount, setVisitedCount] = useState(0);

  const styles = getStyles(theme);

  // 디버깅을 위한 로그
  console.log(
    "🔍 MyPage: 현재 상태 - isLoading:",
    isLoading,
    "isLoggedIn:",
    isLoggedIn,
    "userInfo:",
    userInfo
  );

  // 로딩 중일 때 로딩 UI 표시
  if (isLoading) {
    console.log("🔍 MyPage: 로딩 중 UI 표시");
    return (
      <View style={styles.container}>
        <TopBar title='마이페이지' />
        <View style={styles.loadingContainer}>
          <Ionicons
            name='reload'
            size={60}
            color='#1c3519'
          />
          <Text style={styles.loadingTitle}>로그인 상태 확인 중...</Text>
          <Text style={styles.loadingSubtitle}>잠시만 기다려주세요</Text>
        </View>
      </View>
    );
  }

  // 로그인하지 않은 경우 로그인 화면으로 이동
  if (!isLoggedIn || !userInfo) {
    console.log(
      "🔍 MyPage: 로그인 필요 - isLoggedIn:",
      isLoggedIn,
      "userInfo:",
      userInfo
    );
    return (
      <View style={styles.container}>
        <TopBar title='마이페이지' />
        <View style={styles.loginRequiredContainer}>
          <Ionicons
            name='person-circle-outline'
            size={80}
            color='#ccc'
          />
          <Text style={styles.loginRequiredTitle}>로그인이 필요합니다</Text>
          <Text style={styles.loginRequiredSubtitle}>
            마이페이지를 이용하려면 로그인해주세요
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/")}>
            <Text style={styles.loginButtonText}>로그인 하러가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  console.log("🔍 MyPage: 로그인된 사용자 정보 표시 - userInfo:", userInfo);

  useFocusEffect(
    React.useCallback(() => {
      const loadVisitedCount = async () => {
        try {
          const visitedIdsJSON = await AsyncStorage.getItem(
            "visited_exhibition_ids"
          );
          const visitedIds = visitedIdsJSON ? JSON.parse(visitedIdsJSON) : [];
          setVisitedCount(visitedIds.length);
        } catch (error) {
          console.error("Failed to load visited exhibitions count:", error);
        }
      };

      loadVisitedCount();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            // 저장된 JWT 토큰 제거
            await removeStoredToken();
            // 로컬 사용자 데이터 정리
            clearLocalUserData();
            // AuthContext 로그아웃
            logout();
            router.replace("/");
          } catch (error) {
            console.error("로그아웃 에러:", error);
            // 에러가 발생해도 로그아웃 처리
            logout();
            router.replace("/");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "회원탈퇴",
      "정말 회원탈퇴를 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              if (userInfo?.id) {
                const response = await deleteAccount(
                  userInfo.id,
                  userInfo.accessToken
                );

                if (response.success) {
                  clearLocalUserData();
                  logout();
                  Alert.alert("회원탈퇴 완료", "회원탈퇴가 완료되었습니다.", [
                    {
                      text: "확인",
                      onPress: () => router.replace("/"),
                    },
                  ]);
                } else {
                  Alert.alert(
                    "회원탈퇴 실패",
                    response.message || "회원탈퇴 중 오류가 발생했습니다.",
                    [{ text: "확인" }]
                  );
                }
              } else {
                clearLocalUserData();
                logout();
                Alert.alert("회원탈퇴 완료", "회원탈퇴가 완료되었습니다.", [
                  {
                    text: "확인",
                    onPress: () => router.replace("/"),
                  },
                ]);
              }
            } catch (error) {
              console.error("회원탈퇴 에러:", error);
              Alert.alert("회원탈퇴 실패", "회원탈퇴 중 오류가 발생했습니다.", [
                { text: "확인" },
              ]);
            }
          },
        },
      ]
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderMenuItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showArrow: boolean = true
  ) => (
    <Pressable
      style={styles.menuItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={icon as any}
          size={24}
          color='#1c3519'
        />
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons
          name='chevron-forward'
          size={20}
          color='#ccc'
        />
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <TopBar title='마이페이지' />
      <ScrollView
        style={styles.scrollView}
        pointerEvents='auto'>
        {/* 사용자 정보 섹션 */}
        {renderSection(
          "사용자 정보",
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons
                  name='person'
                  size={40}
                  color='#fff'
                />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{userInfo.name}</Text>
                <Text style={styles.userEmail}>{userInfo.email}</Text>
                <View style={styles.loginType}>
                  <Ionicons
                    name={
                      userInfo.loginType === "google"
                        ? "logo-google"
                        : "logo-github"
                    }
                    size={16}
                    color='#1c3519'
                  />
                  <Text style={styles.loginTypeText}>
                    {userInfo.loginType === "google" ? "Google" : "Naver"}
                    로그인
                  </Text>
                </View>
                <Text style={styles.userId}>ID: {userInfo.id}</Text>
              </View>
            </View>
          </View>
        )}

        {/* 전시 관련 기능 */}
        {renderSection(
          "전시 관리",
          <View>
            {renderMenuItem(
              "bookmark",
              "찜한 전시",
              `${BookmarkedExhibitions.length}개`,
              () => {
                router.push("/(tabs)/mypage/exhibition/Bookmarked");
              }
            )}
            {renderMenuItem(
              "thumbs-up",
              "좋아요 전시",
              `${thumbsUpExhibitions.length}개`,
              () => {
                router.push("/(tabs)/mypage/exhibition/thumbs-up");
              }
            )}
            {renderMenuItem(
              "location",
              "방문한 전시",
              `${visitedCount}개`,
              () => {
                router.push("/(tabs)/mypage/exhibition/visited");
              }
            )}
          </View>
        )}

        {/* 설정 */}
        {renderSection(
          "설정",
          <View>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name='moon'
                  size={24}
                  color='#1c3519'
                />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>다크모드</Text>
                </View>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={(value) => setTheme(value ? "dark" : "light")}
                trackColor={{ false: "#ccc", true: "#1c3519" }}
                thumbColor={theme === "dark" ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>
        )}

        {/* 계정 관리 */}
        {renderSection(
          "계정 관리",
          <View>
            {renderMenuItem(
              "log-out",
              "로그아웃",
              undefined,
              handleLogout,
              false
            )}
            {renderMenuItem(
              "trash",
              "회원탈퇴",
              undefined,
              handleDeleteAccount,
              false
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    scrollView: {
      flex: 1,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginHorizontal: 20,
      marginVertical: 10,
    },
    userSection: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 20,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#1c3519",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginBottom: 4,
    },
    loginType: {
      flexDirection: "row",
      alignItems: "center",
    },
    loginTypeText: {
      fontSize: 12,
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginLeft: 4,
    },
    userId: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 4,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    menuItemText: {
      marginLeft: 15,
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 16,
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
    menuItemSubtitle: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 2,
    },
    loginRequiredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loginRequiredTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#1c3519",
      marginTop: 20,
    },
    loginRequiredSubtitle: {
      fontSize: 16,
      color: "#666",
      marginTop: 10,
      textAlign: "center",
    },
    loginButton: {
      backgroundColor: "#1c3519",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginTop: 30,
    },
    loginButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1c3519",
      marginTop: 20,
    },
    loadingSubtitle: {
      fontSize: 16,
      color: "#666",
      marginTop: 10,
      textAlign: "center",
    },
  });
