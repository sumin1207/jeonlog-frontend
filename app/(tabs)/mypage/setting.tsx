import React, { useState } from "react";
import {
  View,
  Switch,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { clearLocalUserData } from "../../../services/userService";
import { removeStoredToken } from "../../../services/authService";
import { exhibitionData } from "../../../data/exhibitionsDataStorage"; // Import exhibitionData
import { Text, Container } from "../../../design-system";
import { SettingStyles } from "../../../design-system/styles";
import { Colors } from "../../../design-system/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyPageSettingScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  // Get visitedExhibitions from context
  const { BookmarkedExhibitions, thumbsUpExhibitions, visitedExhibitions } =
    useExhibition();
  const { logout, userInfo } = useAuth();

  const [visitedCount, setVisitedCount] = useState(0);

  React.useEffect(() => {
    // 방문한 전시 수 불러오기 (마이페이지와 동일)
    (async () => {
      try {
        const visitedIdsJSON = await AsyncStorage.getItem(
          "visited_exhibition_ids"
        );
        const visitedIds = visitedIdsJSON ? JSON.parse(visitedIdsJSON) : [];
        setVisitedCount(visitedIds.length);
      } catch (error) {
        // 무시
      }
    })();
  }, []);
  // Filter visited exhibitions to get a valid count
  const validVisitedCount = visitedExhibitions.filter(
    (id) => exhibitionData[id as keyof typeof exhibitionData]
  ).length;

  const handleLogout = async () => {
    // 기존 마이페이지와 동일
    await removeStoredToken();
    clearLocalUserData();
    logout();
    Alert.alert("로그아웃 완료", "로그아웃이 완료되었습니다.", [
      { text: "확인", onPress: () => router.replace("/") },
    ]);
    router.replace("/");
  };
  const handleDeleteAccount = async () => {
    clearLocalUserData();
    Alert.alert("회원탈퇴 완료", "회원탈퇴가 완료되었습니다.", [
      { text: "확인", onPress: () => router.replace("/") },
    ]);
    logout();
    router.replace("/");
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={SettingStyles.section}>
      <Text style={SettingStyles.sectionTitle}>{title}</Text>
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
      style={SettingStyles.menuItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={SettingStyles.menuItemLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={Colors.primary.main}
        />
        <View style={SettingStyles.menuItemText}>
          <Text style={SettingStyles.menuItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={SettingStyles.menuItemSubtitle}>{subtitle}</Text>
          )}
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
    <Container
      variant="safe"
      style={SettingStyles.container}>
      <ScrollView
        style={SettingStyles.scrollView}
        pointerEvents='auto'>
        {renderSection(
          "전시 관리",
          <View>
            {renderMenuItem(
              "bookmark",
              "북마크한 전시",
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
            <View style={SettingStyles.menuItem}>
              <View style={SettingStyles.menuItemLeft}>
                <Ionicons
                  name='moon'
                  size={24}
                  color={Colors.primary.main}
                />
                <View style={SettingStyles.menuItemText}>
                  <Text style={SettingStyles.menuItemTitle}>다크모드</Text>
                </View>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={(value) => setTheme(value ? "dark" : "light")}
                trackColor={{ false: "#ccc", true: Colors.primary.main }}
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
    </Container>
  );
}
