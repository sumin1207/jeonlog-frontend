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

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons
              name='notifications-outline'
              size={24}
              color='#1c3519'
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.push("/mypage/setting")}>
            <Ionicons
              name='settings-outline'
              size={24}
              color='#1c3519'
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons
                name='person'
                size={40}
                color='#666'
              />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.userName}>석준's 전시라이프</Text>
              <Text style={styles.userDescription}>
                안녕하세요 저는 전린이입니다.
              </Text>
              <View style={styles.profileButtons}>
                <TouchableOpacity style={styles.profileButton}>
                  <Text style={styles.profileButtonText}>프로필 수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() =>
                    router.push("/(tabs)/mypage/exhibition/Bookmarked")
                  }>
                  <Text style={styles.profileButtonText}>저장한 전시</Text>
                </TouchableOpacity>
                <Ionicons
                  name='person'
                  size={16}
                  color='#666'
                  style={styles.profileIcon}
                />
              </View>
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 전시 기록 섹션 */}
        <View style={styles.recordsSection}>
          <Text style={styles.recordsTitle}>
            나의 전시 기록들({myLogs.length})
          </Text>
          <View style={styles.divider} />
          <View style={styles.recordsGrid}>
            {myLogs.length > 0 ? (
              myLogs.map((log) => {
                const exhibitionId = log.exhibitionId || log.id;
                const exhibition =
                  exhibitionData[exhibitionId as keyof typeof exhibitionData];

                if (!exhibition) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    key={log.id}
                    style={styles.exhibitionCard}
                    onPress={() => {
                      router.push(`/exhibition-log/${log.id}?from=mypage`);
                    }}>
                    <Image
                      source={exhibition.image}
                      style={styles.exhibitionImage}
                      resizeMode='cover'
                    />
                    <Text style={styles.cardDescription}>
                      {exhibition.title}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
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
      backgroundColor: "#ffffff",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: "#ffffff",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#1c3519",
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      marginLeft: 16,
      padding: 8,
    },
    scrollView: {
      flex: 1,
    },
    profileSection: {
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    profileInfo: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#EFEFEF",
      borderWidth: 2,
      borderColor: "#4A90E2",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    profileText: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#1c3519",
      marginBottom: 4,
    },
    userDescription: {
      fontSize: 14,
      color: "#666",
      marginBottom: 16,
    },
    profileButtons: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileButton: {
      backgroundColor: "#F5F5F5",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginRight: 10,
    },
    profileButtonText: {
      fontSize: 14,
      color: "#1c3519",
    },
    profileIcon: {
      marginLeft: 8,
    },
    divider: {
      height: 3,
      backgroundColor: "#E5E5E5",
      marginHorizontal: 20,
      marginVertical: 10,
    },
    recordsSection: {
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    recordsTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#1c3519",
      marginBottom: 10,
    },
    recordsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    exhibitionCard: {
      width: "48%",
      marginBottom: 15,
    },
    exhibitionImage: {
      width: "100%",
      height: 200,
      borderRadius: 12,
      marginBottom: 6,
    },
    cardDescription: {
      fontSize: 12,
      color: "#000000",
      textAlign: "center",
      lineHeight: 16,
    },
    emptyRecords: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 50,
    },
    emptyText: {
      fontSize: 16,
      color: "#666",
    },
  });
