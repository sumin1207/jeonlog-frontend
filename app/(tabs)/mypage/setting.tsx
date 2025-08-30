import React, { useState } from "react";
import {
  View,
  Switch,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { clearLocalUserData } from "../../../services/userService";
import { removeStoredToken } from "../../../services/authService";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";
import { Text, Container } from "../../../design-system";
import { Colors } from "../../../design-system/theme";
import { Spacing } from "../../../design-system/theme";
import { Typography } from "../../../design-system/theme";
import { BorderRadius } from "../../../design-system/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

export default function MyPageSettingScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { BookmarkedExhibitions, thumbsUpExhibitions, visitedExhibitions } =
    useExhibition();
  const { logout, userInfo } = useAuth();

  const [visitedCount, setVisitedCount] = useState(0);

  // 핸드폰 내부 뒤로가기 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true; // 이벤트 소비
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [router])
  );

  React.useEffect(() => {
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

  const validVisitedCount = visitedExhibitions.filter(
    (id) => exhibitionData[id as keyof typeof exhibitionData]
  ).length;

  const handleLogout = async () => {
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

  const handleBackPress = () => {
    router.back();
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
          color={Colors.primary.main}
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
          color={
            theme === "dark" ? Colors.neutral.gray500 : Colors.neutral.gray400
          }
        />
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={
              theme === "dark" ? Colors.text.dark.primary : Colors.text.primary
            }
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {renderSection(
          "전시 관리",
          <View style={styles.sectionContent}>
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
          <View style={styles.sectionContent}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name='moon'
                  size={24}
                  color={Colors.primary.main}
                />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>다크모드</Text>
                </View>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={(value) => setTheme(value ? "dark" : "light")}
                trackColor={{
                  false:
                    theme === "dark"
                      ? Colors.neutral.gray600
                      : Colors.neutral.gray300,
                  true: Colors.primary.main,
                }}
                thumbColor={
                  theme === "dark"
                    ? Colors.neutral.gray200
                    : Colors.neutral.white
                }
              />
            </View>
          </View>
        )}

        {renderSection(
          "계정 관리",
          <View style={styles.sectionContent}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray100,
  },
  backButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.button.small,
  },
  headerTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerRight: {
    width: 40, // 뒤로가기 버튼과 동일한 너비로 균형 맞춤
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.text.h4.fontSize,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card.medium,
    overflow: "hidden",
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray100,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Typography.text.body.fontSize,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  menuItemSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
});
