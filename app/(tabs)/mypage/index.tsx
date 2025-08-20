import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// TopBar import 제거
// import TopBar from "../../../components/ui/TopBar";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { clearLocalUserData } from "../../../services/userService";
import { removeStoredToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";

// 임시 회원탈퇴 함수 (나중에 실제 구현으로 교체)
const deleteAccount = async (userId: string, accessToken?: string) => {
  return { success: true, message: "회원탈퇴 완료" };
};

export default function MyPageScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn, logout, userInfo, isLoading } = useAuth();
  const { BookmarkedExhibitions, thumbsUpExhibitions, visitedExhibitions, myLogs } =
    useExhibition();
  const [visitedCount, setVisitedCount] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const styles = getStyles(theme);

  // 방문한 기록 카운트 통일
  const validVisitedCount = visitedExhibitions.filter(
    (id) => exhibitionData[id as keyof typeof exhibitionData]
  ).length;

  const handleGuestAction = () => {
    Alert.alert(
      "로그인 필요",
      "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "로그인", onPress: () => router.push("/") },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
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
  // if (!isLoggedIn || !userInfo) {
  //   console.log(
  //     "🔍 MyPage: 로그인 필요 - isLoggedIn:",
  //     isLoggedIn,
  //     "userInfo:",
  //     userInfo
  //   );
  //   return (
  //     <View style={styles.container}>
  //       <TopBar title='마이페이지' />
  //       <View style={styles.loginRequiredContainer}>
  //         <Ionicons
  //           name='person-circle-outline'
  //           size={80}
  //           color='#ccc'
  //         />
  //         <Text style={styles.loginRequiredTitle}>로그인이 필요합니다</Text>
  //         <Text style={styles.loginRequiredSubtitle}>
  //           마이페이지를 이용하려면 로그인해주세요
  //         </Text>
  //         <TouchableOpacity
  //           style={styles.loginButton}
  //           onPress={() => router.push("/")}>
  //           <Text style={styles.loginButtonText}>로그인 하러가기</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }

  console.log("🔍 MyPage: 로그인된 사용자 정보 표시 - userInfo:", userInfo);

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
      {/* 상단 우측 버튼들 - 헤더 바 없이 */}
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.topButton}>
          <Ionicons
            name='notifications-outline'
            size={24}
            color='#1c3519'
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => router.push("/mypage/setting")}>
          <Ionicons
            name='settings-outline'
            size={24}
            color='#1c3519'
          />
        </TouchableOpacity>
      </View>

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
                <Text style={styles.userName}>
                  {userInfo?.name ?? "닉네임"}
                </Text>
                <View style={styles.userStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statCount}>0</Text>
                    <Text style={styles.statLabel}>기록 수</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statCount}>0</Text>
                    <Text style={styles.statLabel}>팔로워</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statCount}>0</Text>
                    <Text style={styles.statLabel}>팔로잉</Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>홈편집</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons
                      name='bookmark'
                      size={16}
                      color='#1c3519'
                    />
                    <Text style={styles.actionButtonText}>저장한 전시</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 전시 관리 섹션 */}
        {renderSection(
          "전시 관리",
          <View style={styles.activitySection}>
            <TouchableOpacity
              style={styles.activityItem}
              onPress={() =>
                router.push("/(tabs)/mypage/exhibition/Bookmarked")
              }>
              <Text style={styles.activityCount}>
                {BookmarkedExhibitions.length}
              </Text>
              <Text style={styles.activityLabel}>찜한 전시</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.activityItem}
              onPress={() =>
                router.push("/(tabs)/mypage/exhibition/thumbs-up")
              }>
              <Text style={styles.activityCount}>
                {thumbsUpExhibitions.length}
              </Text>
              <Text style={styles.activityLabel}>좋아요 전시</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.activityItem}
              onPress={() => router.push("/(tabs)/mypage/exhibition/visited")}>
              <Text style={styles.activityCount}>
                {visitedExhibitions.length}
              </Text>
              <Text style={styles.activityLabel}>방문한 전시</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 나의 전시 기록들 섹션 */}
        {renderSection(
          "나의 전시 기록들",
          <View style={styles.recordsSection}>
            <View style={styles.recordsHeader}>
              <View style={styles.sortOptions}>
                <TouchableOpacity style={styles.sortOption}>
                  <Text style={[styles.sortText, styles.sortActive]}>
                    최신순
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortOption}>
                  <Text style={styles.sortText}>인기순</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.recordsGrid}>
              {myLogs.slice(0, 2).map((log, index) => {
                // Retrieve exhibition data directly from exhibitionData for image and other details
                const exhibition = exhibitionData[log.id as keyof typeof exhibitionData];

                if (!exhibition) return null; // If exhibition data is not found, don't render

                return (
                  <TouchableOpacity
                    key={log.id}
                    style={styles.recordCard}
                    onPress={() =>
                      router.push({
                        pathname: `/exhibition-log/${log.id}`,
                        params: { 'exhibitionLog-id': log.id },
                      })
                    }>
                    <Image
                      source={exhibition.image} // Use image from exhibitionData
                      style={styles.recordImage}
                      resizeMode='cover'
                    />
                    <View style={styles.recordInfo}>
                      <Text
                        style={styles.recordTitle}
                        numberOfLines={2}>
                        {log.title}
                      </Text>
                      <View style={styles.hashtagsContainer}>
                        {log.hashtags && log.hashtags.map((tag: string, tagIndex: number) => (
                          <Text key={tagIndex} style={styles.hashtag}>#{tag}</Text>
                        ))}
                      </View>
                      <Text style={styles.recordDate}>{formatDate(log.createdAt)}</Text>
                      <View style={styles.recordMeta}>
                        <View style={styles.recordAuthor}>
                          <View style={styles.authorAvatar}>
                            <Ionicons
                              name='person'
                              size={12}
                              color='#666'
                            />
                          </View>
                          <Text style={styles.authorName}>{log.author?.name || '사용자'}</Text>
                        </View>
                        <View style={styles.recordLikes}>
                          <Ionicons
                            name='heart'
                            size={12}
                            color='#ff6b6b'
                          />
                          <Text style={styles.likesCount}>{log.likes || 0}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {myLogs.length === 0 && (
                <View style={styles.emptyRecords}>
                  <Text style={styles.emptyText}>작성한 전시 기록이 없습니다</Text>
                </View>
              )}
            </View>
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
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginTop: 16,
    },
    loadingSubtitle: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 8,
    },
    section: {
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 10,
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
    userSection: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: theme === "dark" ? "#222" : "#fff",
      borderRadius: 12,
      marginBottom: 16,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#EFEFEF",
      marginRight: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
    userEmail: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 2,
    },
    loginType: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    loginTypeText: {
      fontSize: 12,
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginLeft: 4,
    },
    userId: {
      fontSize: 12,
      color: theme === "dark" ? "#888" : "#888",
      marginTop: 2,
    },
    activitySection: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: theme === "dark" ? "#222" : "#fff",
      borderRadius: 12,
      paddingVertical: 16,
      marginBottom: 16,
    },
    activityItem: {
      alignItems: "center",
      flex: 1,
    },
    activityCount: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
    activityLabel: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 4,
    },
    scrollView: {
      flex: 1,
    },
    // 기존 스타일 유지
    headerWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#1c3519",
      height: 90,
      paddingTop: 35,
      paddingHorizontal: 16,
    },
    headerLeft: {
      flex: 1,
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIconBtn: {
      marginLeft: 16,
      padding: 4,
    },
    socialSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: theme === "dark" ? "#222" : "#fff",
      borderRadius: 12,
      paddingVertical: 16,
      marginBottom: 16,
    },
    socialItem: {
      alignItems: "center",
      flex: 1,
    },
    socialCount: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
    socialLabel: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 4,
    },
    userStats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
      marginBottom: 15,
    },
    statItem: {
      alignItems: "center",
    },
    statCount: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
    statLabel: {
      fontSize: 12,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 4,
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#ccc",
    },
    actionButtonText: {
      fontSize: 14,
      color: "#1c3519",
      marginLeft: 5,
    },
    recordsSection: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: theme === "dark" ? "#222" : "#fff",
      borderRadius: 12,
      marginBottom: 16,
    },
    recordsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    sortOptions: {
      flexDirection: "row",
      backgroundColor: "#f0f0f0",
      borderRadius: 20,
      padding: 3,
    },
    sortOption: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 15,
    },
    sortText: {
      fontSize: 14,
      color: "#666",
    },
    sortActive: {
      color: "#1c3519",
      fontWeight: "bold",
    },
    recordsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    recordCard: {
      width: "48%", // 2 columns
      aspectRatio: 0.75, // 3:4 ratio (height is 4/3 of width)
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 10,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#eee",
    },
    recordImage: {
      width: "100%",
      height: "100%",
      resizeMode: 'contain',
    },
    recordInfo: {
      padding: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    recordTitle: {
      fontSize: 14,
      color: "#fff",
      fontWeight: "bold",
      marginBottom: 5,
    },
    hashtagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 5,
    },
    hashtag: {
      fontSize: 10,
      color: '#ccc',
      marginRight: 5,
    },
    recordDate: {
      fontSize: 10,
      color: '#ccc',
      marginBottom: 5,
    },
    recordMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    recordAuthor: {
      flexDirection: "row",
      alignItems: "center",
    },
    authorAvatar: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "#ccc",
      justifyContent: "center",
      alignItems: "center",
    },
    authorName: {
      fontSize: 12,
      color: "#fff",
      marginLeft: 5,
    },
    recordLikes: {
      flexDirection: "row",
      alignItems: "center",
    },
    likesCount: {
      fontSize: 12,
      color: "#ff6b6b",
      marginLeft: 5,
    },
    emptyRecords: {
      alignItems: "center",
      paddingVertical: 20,
    },
    emptyText: {
      fontSize: 16,
      color: "#666",
    },
    topButtons: {
      position: "absolute",
      top: 5,
      right: 20,
      flexDirection: "row",
      zIndex: 10,
    },
    topButton: {
      marginLeft: 10,
      padding: 5,
    },
  });
