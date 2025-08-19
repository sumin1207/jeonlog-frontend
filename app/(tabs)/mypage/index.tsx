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
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { clearLocalUserData } from "../../../services/userService";
import { removeStoredToken } from "../../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ExhibitionLogCard from "../exhibition-log/ExhibitionLogCard";
import { useEffect } from "react";

// 임시 회원탈퇴 함수 (나중에 실제 구현으로 교체)
const deleteAccount = async (userId: string, accessToken?: string) => {
  return { success: true, message: "회원탈퇴 완료" };
};

export default function MyPageScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn, logout, userInfo, isLoading } = useAuth();
  const { BookmarkedExhibitions, thumbsUpExhibitions, visitedExhibitions } =
    useExhibition();
  const [visitedCount, setVisitedCount] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [myRecords, setMyRecords] = useState<any[]>([]);
  const [recordSort, setRecordSort] = useState<"latest" | "popular">("latest");
  const windowWidth = Dimensions.get("window").width;

  // 내 기록 불러오기 (최신순)
  useEffect(() => {
    const loadMyRecords = async () => {
      try {
        const savedRecordsJSON = await AsyncStorage.getItem(
          "exhibition_records"
        );
        const savedRecords = savedRecordsJSON
          ? JSON.parse(savedRecordsJSON)
          : {};
        const visitedIdsJSON = await AsyncStorage.getItem(
          "visited_exhibition_ids"
        );
        const visitedIds = visitedIdsJSON ? JSON.parse(visitedIdsJSON) : [];
        const exhibitionData =
          require("../../../data/exhibitionsDataStorage").exhibitionData;
        const records = visitedIds
          .map((exhibitionId: string) => {
            const exhibition = exhibitionData[exhibitionId];
            if (!exhibition) return null;
            const record = savedRecords[exhibitionId];
            if (!record) return null;
            return {
              id: exhibition.id,
              image: exhibition.image,
              logTitle: record.title,
              author: {
                name: userInfo?.name || "user",
                avatar: require("../../../assets/images/mainIcon.png"),
              },
              timestamp: record.createdAt,
              likes: 0,
              hashtags: record.hashtags || ["전시기록"],
            };
          })
          .filter(Boolean)
          .reverse();
        setMyRecords(records);
      } catch (e) {
        setMyRecords([]);
      }
    };
    loadMyRecords();
  }, [userInfo]);

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
      {/* 상단 알림/설정 버튼만 오른쪽 상단에 띄움 */}
      <View
        style={[
          styles.headerIcons,
          { position: "absolute", top: 20, right: 16, zIndex: 10 },
        ]}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push("/mypage/setting")}>
          <Ionicons
            name='notifications-outline'
            size={24}
            color={theme === "dark" ? "#fff" : "#1c3519"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push("/mypage/setting")}>
          <Ionicons
            name='settings-outline'
            size={24}
            color={theme === "dark" ? "#fff" : "#1c3519"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        pointerEvents='auto'>
        {/* 프로필 영역 - 이미지처럼 세로 중앙 정렬 */}
        <View
          style={{
            backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
            paddingTop: 32,
            paddingBottom: 18,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: theme === "dark" ? "#3a3a3a" : "#ededed",
          }}>
          {/* 프로필 사진 */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme === "dark" ? "#3a3a3a" : "#ededed",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}>
            <Ionicons
              name='person'
              size={54}
              color={theme === "dark" ? "#888" : "#bdbdbd"}
            />
          </View>
          {/* 닉네임 */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#222",
              marginBottom: 10,
            }}>
            {userInfo?.name ?? "닉네임"}
          </Text>
          {/* 기록수/팔로워/팔로잉 */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}>
            <View style={{ alignItems: "center", marginHorizontal: 12 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: theme === "dark" ? "#fff" : "#222",
                }}>
                {visitedExhibitions?.length ?? 0}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme === "dark" ? "#ccc" : "#888",
                }}>
                기록 수
              </Text>
            </View>
            <View style={{ alignItems: "center", marginHorizontal: 12 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: theme === "dark" ? "#fff" : "#222",
                }}>
                0
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme === "dark" ? "#ccc" : "#888",
                }}>
                팔로워
              </Text>
            </View>
            <View style={{ alignItems: "center", marginHorizontal: 12 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: theme === "dark" ? "#fff" : "#222",
                }}>
                0
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme === "dark" ? "#ccc" : "#888",
                }}>
                팔로잉
              </Text>
            </View>
          </View>
          {/* 버튼 영역: 중앙 정렬, 동일한 스타일 */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 4,
            }}>
            <TouchableOpacity
              style={{
                height: 36,
                minWidth: 110,
                borderRadius: 8,
                backgroundColor: theme === "dark" ? "#222" : "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme === "dark" ? "#3a3a3a" : "#ededed",
                marginRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: theme === "dark" ? "#fff" : "#222",
                  fontWeight: "bold",
                }}>
                프로필 수정
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 36,
                minWidth: 110,
                borderRadius: 8,
                backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                borderWidth: 1,
                borderColor: theme === "dark" ? "#3a3a3a" : "#ededed",
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
              onPress={() => router.push("/mypage/exhibition/Bookmarked")}>
              <Ionicons
                name='bookmark-outline'
                size={20}
                color={theme === "dark" ? "#fff" : "#222"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: theme === "dark" ? "#fff" : "#222",
                  fontWeight: "bold",
                }}>
                저장한 전시
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 구분선 */}
        <View
          style={{
            height: 8,
            backgroundColor: theme === "dark" ? "#222" : "#fafafa",
            width: "100%",
          }}
        />
        {/* 내 전시 기록 섹션 타이틀/토글 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 16,
            marginTop: 18,
            marginBottom: 8,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#222",
            }}>
            나의 전시 기록들
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => setRecordSort("latest")}>
              <Text
                style={{
                  fontSize: 13,
                  color: recordSort === "latest" ? "#1976d2" : "#bbb",
                  fontWeight: recordSort === "latest" ? "bold" : "normal",
                  marginRight: 8,
                }}>
                최신순
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRecordSort("popular")}>
              <Text
                style={{
                  fontSize: 13,
                  color: recordSort === "popular" ? "#1976d2" : "#bbb",
                  fontWeight: recordSort === "popular" ? "bold" : "normal",
                }}>
                인기순
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 내 전시 기록 카드 리스트 */}
        <View style={{ marginHorizontal: 12, marginBottom: 20 }}>
          {myRecords.length === 0 ? (
            <Text style={{ color: "#bbb", textAlign: "center", marginTop: 30 }}>
              아직 기록한 전시가 없습니다.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}>
              {myRecords.map((item, idx) => (
                <View
                  key={item.id}
                  style={{ marginRight: 16 }}>
                  <ExhibitionLogCard {...item} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
      position: "relative", // 버튼 absolute 위치 보장
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
    activitySection: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 20,
    },
    activityItem: {
      alignItems: "center",
    },
    activityCount: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
    activityLabel: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 5,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 24,
      width: 280,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#1c3519",
    },
    modalButton: {
      width: "100%",
      paddingVertical: 14,
      borderRadius: 8,
      backgroundColor: "#f5f5f5",
      marginBottom: 12,
      alignItems: "center",
    },
    modalButtonText: {
      fontSize: 16,
      color: "#1c3519",
      fontWeight: "bold",
    },
    modalCloseButton: {
      marginTop: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    modalCloseButtonText: {
      color: "#666",
      fontSize: 15,
    },
    headerWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#1c3519",
      height: 80,
      paddingTop: 20,
      paddingHorizontal: 16,
    },
    headerLogo: {
      width: 120,
      height: 40,
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIconBtn: {
      marginLeft: 16,
      padding: 4,
    },
  });
