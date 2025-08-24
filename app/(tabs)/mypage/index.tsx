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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.topButton}>
            <Ionicons name="notifications-outline" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => router.push("/mypage/setting")}
          >
            <Ionicons name="settings-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>{/* 프로필 이미지 또는 아이콘 */}</View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userInfo?.name ?? "석준's 전시라이프"}
            </Text>
            <Text style={styles.profileBio}>안녕하세요 저는 전린이입니다.</Text>
          </View>
        </View>

        <View style={styles.buttonsSection}>
          <View style={styles.mainButtonsWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>프로필 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { marginLeft: 10 }]}
              onPress={() =>
                router.push("/(tabs)/mypage/exhibition/Bookmarked")
              }
            >
              <Text style={styles.actionButtonText}>저장한 전시</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-outline" size={19} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.logsSection}>
          <Text style={styles.logsTitle}>
            나의 전시 기록들 ({myLogs.length})
          </Text>
          <View style={styles.recordsGrid}>
            {myLogs.map((log, index) => {
              const exhibition =
                exhibitionData[log.id as keyof typeof exhibitionData];
              if (!exhibition) return null;

              return (
                <TouchableOpacity
                  key={log.id}
                  style={styles.logCard}
                  onPress={() => {
                    router.push(`/exhibition-log/${log.id}?from=mypage`);
                  }}
                >
                  <Image source={exhibition.image} style={styles.logImage} />
                  <Text style={styles.logTitle} numberOfLines={1}>
                    {exhibition.title}
                  </Text>
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
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
    headerIcons: {
      flexDirection: "row",
    },
    topButton: {
      marginLeft: 16,
    },
    scrollView: {
      flex: 1,
    },
    profileSection: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#f0f0f0",
      marginRight: 15,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 19,
      fontWeight: "bold",
    },
    profileBio: {
      fontSize: 13,
      color: "#555",
      marginTop: 6,
    },
    buttonsSection: {
      flexDirection: "row",
      paddingHorizontal: 20,
      marginBottom: 25,
      alignItems: "center",
    },
    mainButtonsWrapper: {
      flex: 1,
      flexDirection: "row",
      marginRight: 10,
    },
    actionButton: {
      flex: 1,
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
      paddingVertical: 7.7,
      alignItems: "center",
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    iconButton: {
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    divider: {
      height: 10,
      backgroundColor: "#f5f5f5",
    },
    logsSection: {
      padding: 20,
    },
    logsTitle: {
      fontSize: 17,
      fontWeight: "bold",
      marginBottom: 15,
    },
    recordsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    logCard: {
      width: "48%",
      marginBottom: 20,
    },
    logImage: {
      width: "100%",
      height: 220,
      borderRadius: 8,
    },
    logTitle: {
      marginTop: 8,
      fontSize: 13,
      color: "#333",
      textAlign: "center",
    },
    emptyRecords: {
      width: "100%",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: "#888",
    },
    loginRequiredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    loginRequiredTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
    },
    loginRequiredSubtitle: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 30,
    },
    loginButton: {
      backgroundColor: "#1e90ff",
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 8,
    },
    loginButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
