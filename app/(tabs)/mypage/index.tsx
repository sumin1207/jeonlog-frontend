import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";

export default function MyPageScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn, logout, userInfo, isLoading } = useAuth();
  const { myLogs } = useExhibition();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const styles = getStyles(theme);

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

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 우측 버튼들 - 헤더 바 없이 */}
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.topButton}>
          <Ionicons name="notifications-outline" size={24} color="#1c3519" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => router.push("/mypage/setting")}
        >
          <Ionicons name="settings-outline" size={24} color="#1c3519" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} pointerEvents="auto">
        {/* 사용자 정보 섹션 */}
        {renderSection(
          "사용자 정보",
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#fff" />
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
                    <Text style={styles.actionButtonText}>프로필 수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push("/(tabs)/mypage/exhibition/Bookmarked")
                    }
                  >
                    <Ionicons name="bookmark" size={16} color="#1c3519" />
                    <Text style={styles.actionButtonText}>북마크한 전시</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 나의 전시 기록들 섹션 */}
        {renderSection(
          "나의 전시 기록들",
          <View style={styles.recordsSection}>
            <View style={styles.recordsHeader}></View>
            <View style={styles.recordsGrid}>
              {myLogs.slice(0, 2).map((log, index) => {
                const exhibition =
                  exhibitionData[log.id as keyof typeof exhibitionData];

                if (!exhibition) return null;

                return (
                  <TouchableOpacity
                    key={log.id}
                    style={{ width: "48%" }}
                    onPress={() => {
                      router.push(`/exhibition-log/${log.id}?from=mypage`);
                    }}
                  >
                    <View style={styles.card}>
                      <Image
                        source={exhibition.image}
                        style={styles.mainImage}
                      />
                      <View style={styles.contentContainer}>
                        <Text style={styles.authorName}>
                          {exhibition.title}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {myLogs.length === 0 && (
                <View style={styles.emptyRecords}>
                  <Text style={styles.emptyText}>
                    작성한 전시 기록이 없습니다
                  </Text>
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
    logAvatar: {
      width: 25,
      height: 25,
      borderRadius: 16,
      marginRight: 8,
      backgroundColor: "#ccc",
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
    emptyRecords: {
      width: "100%",
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
    // Styles from ExhibitionLogCard
    card: {
      marginBottom: 20,
      overflow: "hidden",
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
    },
    mainImage: {
      width: "100%",
      height: 213,
      borderRadius: 8,
    },
    contentContainer: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: 8,
      alignItems: "center",
    },
    authorAndLikesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flex: 1,
      marginRight: 8,
    },
    authorName: {
      fontWeight: "bold",
      fontSize: 14,
    },
    authorTextContainer: {
      flex: 1,
    },
    timestamp: {
      fontSize: 10.5,
      color: "#7f7f7fff",
    },
    likesContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    hashtagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 8,
    },
    hashtag: {
      fontSize: 12,
      color: "#9e9e9eff",
      marginRight: 8,
      marginBottom: 4,
    },
  });
