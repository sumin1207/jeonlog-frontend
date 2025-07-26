import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme, ThemeType } from "../../contexts/ThemeContext";
import { useAuth } from "../../components/AuthContext";
import { deleteAccount, clearLocalUserData } from "../../services/userService";

export default function MyPageScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn, logout, userInfo } = useAuth();

  // 임시 사용자 데이터 (나중에 실제 데이터로 교체)
  const userData = {
    name: "홍길동",
    loginType: "google", // "google" 또는 "naver"
    email: "hong@example.com",
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: () => {
          logout(); // 새로운 logout 함수 사용
          router.replace("/"); // 첫 페이지로 이동
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
              // 로딩 상태 표시 (선택사항)
              // setIsLoading(true);

              // 서버에 회원 탈퇴 요청
              if (userInfo?.id) {
                const response = await deleteAccount(
                  userInfo.id,
                  userInfo.accessToken
                );

                if (response.success) {
                  // 로컬 데이터 삭제
                  clearLocalUserData();

                  // AuthContext에서 로그아웃
                  logout();

                  // 성공 메시지 표시
                  Alert.alert("회원탈퇴 완료", "회원탈퇴가 완료되었습니다.", [
                    {
                      text: "확인",
                      onPress: () => router.replace("/"),
                    },
                  ]);
                } else {
                  // 서버 에러 처리
                  Alert.alert(
                    "회원탈퇴 실패",
                    response.message || "회원탈퇴 중 오류가 발생했습니다.",
                    [{ text: "확인" }]
                  );
                }
              } else {
                // 사용자 정보가 없는 경우 (개발용)
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
            } finally {
              // 로딩 상태 해제 (선택사항)
              // setIsLoading(false);
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

  const styles = getStyles(theme);

  return (
    <ScrollView
      style={styles.container}
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
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
              <View style={styles.loginType}>
                <Ionicons
                  name={
                    userData.loginType === "google"
                      ? "logo-google"
                      : "logo-github"
                  }
                  size={16}
                  color='#1c3519'
                />
                <Text style={styles.loginTypeText}>
                  {userData.loginType === "google" ? "Google" : "Naver"} 로그인
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 전시 관련 기능 */}
      {renderSection(
        "전시 관리",
        <View>
          {renderMenuItem("heart", "찜한 전시", "0개", () => {
            // 찜한 전시 목록으로 이동
          })}
          {renderMenuItem("thumbs-up", "좋아요 전시", "0개", () => {
            // 좋아요 전시 목록으로 이동
          })}
          {renderMenuItem("location", "방문한 전시", "0개", () => {
            // 방문한 전시 목록으로 이동
          })}
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
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
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
  });
