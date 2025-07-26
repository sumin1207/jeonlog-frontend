import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MyPageScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

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
          // 로그아웃 로직 구현
          router.replace("/");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원탈퇴",
      "정말 회원탈퇴를 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: () => {
            // 회원탈퇴 로직 구현
            router.replace("/");
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
    <TouchableOpacity
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
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
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
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#ccc", true: "#1c3519" }}
              thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c3519",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  userSection: {
    backgroundColor: "#fff",
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
    color: "#1c3519",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  loginType: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginTypeText: {
    fontSize: 12,
    color: "#1c3519",
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    color: "#1c3519",
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
