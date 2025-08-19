import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../components/context/AuthContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import ExhibitionLogCard from "../exhibition-log/ExhibitionLogCard";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";

export default function MyPageScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isLoggedIn, userInfo, isLoading } = useAuth();
  // exhibitionContext에서 전시 기록 데이터 받아오는거로 통일
  const { myLogs, visitedExhibitions } = useExhibition();
  
  const [sortOrder, setSortOrder] = useState("최신순");
  const styles = getStyles(theme);

  // 방문한 기록 카운트 통일
  const validVisitedCount = visitedExhibitions.filter(id => exhibitionData[id as keyof typeof exhibitionData]).length;

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
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1c3519" />
      </View>
    );
  }


  const exhibitionRecords = myLogs.map(log => {
      const exhibition = exhibitionData[log.id as keyof typeof exhibitionData];
      return {
        ...log,
        image: exhibition?.image || require("../../../assets/images/exhibitionPoster/exhibition1.png"),
        logTitle: log.title,
        author: { 
            name: userInfo?.name || "사용자",
            avatar: require("../../../assets/images/mainIcon.png")
        },
        timestamp: new Date(log.createdAt).toLocaleDateString(),
        likes: 0, 
        hashtags: log.hashtags || [],
      };
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View />
        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push("/(tabs)/mypage/setting")}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={!isLoggedIn ? handleGuestAction : () => {}}>
              <View style={styles.avatar} />
            </TouchableOpacity>
            <View style={styles.profileText}>
              <Text style={styles.nickname}>{isLoggedIn && userInfo ? userInfo.name : '닉네임'}</Text>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{validVisitedCount}</Text>
                  <Text style={styles.statLabel}>방문한 전시</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text> 
                  <Text style={styles.statLabel}>팔로워</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text> 
                  <Text style={styles.statLabel}>팔로잉</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.profileButtons}>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={isLoggedIn ? () => {} : handleGuestAction}>
              <Text style={styles.editProfileButtonText}>홈편집</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.savedExhibitionsButton}
              onPress={() => router.push("/(tabs)/mypage/exhibition/Bookmarked")}>
              <Ionicons name="bookmark-outline" size={16} color="#000" />
              <Text style={styles.savedExhibitionsButtonText}>저장한 전시</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.recordsSection}>
          <View style={styles.recordsHeader}>
            <Text style={styles.recordsTitle}>나의 전시 기록들</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity onPress={() => setSortOrder("최신순")}>
                <Text style={[styles.sortText, sortOrder === '최신순' && styles.activeSortText]}>최신순</Text>
              </TouchableOpacity>
              <Text style={styles.sortDivider}>|</Text>
              <TouchableOpacity onPress={() => setSortOrder("인기순")}>
                <Text style={[styles.sortText, sortOrder === '인기순' && styles.activeSortText]}>인기순</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.recordsGrid}>
            {exhibitionRecords.length > 0 ? (
              exhibitionRecords.map((log) => (
                <TouchableOpacity key={log.id} onPress={() => router.push({ pathname: `/exhibition-log/${log.id}`, params: { 'exhibition-log-id': log.id } })}>
                    <ExhibitionLogCard {...log} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.centeredMessageContainer}>
                  <Text style={styles.noRecordsText}>
                      {isLoggedIn ? "아직 작성한 기록이 없어요." : "로그인하고 첫 전시 기록을 남겨보세요."}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIconBtn: {
      marginLeft: 16,
      padding: 4,
    },
    profileSection: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: '#fff',
    },
    profileInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: "#EFEFEF",
      marginRight: 20,
    },
    profileText: {
      flex: 1,
    },
    nickname: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    stats: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 18,
      fontWeight: "bold",
    },
    statLabel: {
      fontSize: 14,
      color: "#666",
      marginTop: 4,
    },
    profileButtons: {
      flexDirection: "row",
      marginTop: 20,
    },
    editProfileButton: {
      flex: 1,
      backgroundColor: "#EFEFEF",
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
      marginRight: 8,
    },
    editProfileButtonText: {
      fontWeight: "bold",
    },
    savedExhibitionsButton: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: "#EFEFEF",
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    savedExhibitionsButtonText: {
      fontWeight: "bold",
      marginLeft: 4,
    },
    divider: {
      height: 8,
      backgroundColor: "#F5F5F5",
    },
    recordsSection: {
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: '#fff',
    },
    recordsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    recordsTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    sortButtons: {
      flexDirection: "row",
      alignItems: "center",
    },
    sortText: {
      fontSize: 13,
      color: "#999",
    },
    activeSortText: {
        color: '#000',
        fontWeight: 'bold',
    },
    sortDivider: {
      marginHorizontal: 5,
      color: "#E0E0E0",
    },
    recordsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    centeredMessageContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
        paddingBottom: 40,
    },
    noRecordsText: {
        fontSize: 16,
        color: '#888',
    },
  });
