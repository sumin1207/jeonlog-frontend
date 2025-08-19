import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { clearLocalUserData } from "../../../services/userService";
import { removeStoredToken } from "../../../services/authService";
import { exhibitionData } from "../../../data/exhibitionsDataStorage"; // Import exhibitionData

export default function MyPageSettingScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  // Get visitedExhibitions from context
  const { BookmarkedExhibitions, thumbsUpExhibitions, visitedExhibitions } = useExhibition();
  const { logout, userInfo } = useAuth();

  // Filter visited exhibitions to get a valid count
  const validVisitedCount = visitedExhibitions.filter(id => exhibitionData[id as keyof typeof exhibitionData]).length;

  const handleLogout = async () => {
    // 기존 마이페이지와 동일
    await removeStoredToken();
    clearLocalUserData();
    logout();
    router.replace("/");
  };
  const handleDeleteAccount = async () => {
    clearLocalUserData();
    logout();
    router.replace("/");
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
  const renderMenuItem = (
    icon: any,
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
          name={icon}
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
      <ScrollView
        style={styles.scrollView}
        pointerEvents='auto'>
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
              "location-outline",
              "방문한 전시",
              `${validVisitedCount}개`,
              () => {
                router.push("/(tabs)/mypage/exhibition/visited");
              }
            )}
          </View>
        )}
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

import AsyncStorage from "@react-native-async-storage/async-storage";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    color: "#1c3519",
    marginHorizontal: 20,
    marginVertical: 10,
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
