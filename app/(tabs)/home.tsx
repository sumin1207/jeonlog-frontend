import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import HorizontalSliding from "@/components/exhibition/HorizontalSliding";
import RecommendForYou from "@/components/exhibition/RecommendForYou";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import { ExhibitionCardSkeleton } from "@/components/ui/Skeleton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("20-30대");
  const router = useRouter();

  useEffect(() => {
    const loadHomeData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setLoading(false);
    };
    loadHomeData();
  }, []);

  const tabs = ["전체", "연령대별 추천", "성별 추천"];
  const ageGroups = ["10대", "20-30대", "40-50대", "60대 이상"];

  // 추천 데이터
  const getRecommendationData = () => {
    if (activeTab === "전체") {
      return [
        {
          id: "1",
          title: "추천 1",
          location: "전시장 A",
          date: "2025.01.01~03.31",
        },
        {
          id: "2",
          title: "추천 2",
          location: "전시장 B",
          date: "2025.02.01~04.30",
        },
        {
          id: "3",
          title: "추천 3",
          location: "전시장 C",
          date: "2025.03.01~05.31",
        },
        {
          id: "4",
          title: "추천 4",
          location: "전시장 D",
          date: "2025.04.01~06.30",
        },
      ];
    } else if (activeTab === "연령대별 추천") {
      const ageData: Record<
        string,
        Array<{ id: string; title: string; location: string; date: string }>
      > = {
        "10대": [
          {
            id: "5",
            title: "추천 5",
            location: "전시장 E",
            date: "2025.05.01~07.31",
          },
          {
            id: "6",
            title: "추천 6",
            location: "전시장 F",
            date: "2025.06.01~08.31",
          },
          {
            id: "7",
            title: "추천 7",
            location: "전시장 G",
            date: "2025.07.01~09.30",
          },
          {
            id: "8",
            title: "추천 8",
            location: "전시장 H",
            date: "2025.08.01~10.31",
          },
        ],
        "20-30대": [
          {
            id: "9",
            title: "추천 9",
            location: "전시장 I",
            date: "2025.09.01~11.30",
          },
          {
            id: "10",
            title: "추천 10",
            location: "전시장 J",
            date: "2025.10.01~12.31",
          },
          {
            id: "11",
            title: "추천 11",
            location: "전시장 K",
            date: "2025.11.01~2026.01.31",
          },
          {
            id: "12",
            title: "추천 12",
            location: "전시장 L",
            date: "2025.12.01~2026.02.28",
          },
        ],
        "40-50대": [
          {
            id: "13",
            title: "추천 13",
            location: "전시장 M",
            date: "2026.01.01~03.31",
          },
          {
            id: "14",
            title: "추천 14",
            location: "전시장 N",
            date: "2026.02.01~04.30",
          },
          {
            id: "15",
            title: "추천 15",
            location: "전시장 O",
            date: "2026.03.01~05.31",
          },
          {
            id: "16",
            title: "추천 16",
            location: "전시장 P",
            date: "2026.04.01~06.30",
          },
        ],
        "60대 이상": [
          {
            id: "17",
            title: "추천 17",
            location: "전시장 Q",
            date: "2026.05.01~07.31",
          },
          {
            id: "18",
            title: "추천 18",
            location: "전시장 R",
            date: "2026.06.01~08.31",
          },
          {
            id: "19",
            title: "추천 19",
            location: "전시장 S",
            date: "2026.07.01~09.30",
          },
          {
            id: "20",
            title: "추천 20",
            location: "전시장 T",
            date: "2026.08.01~10.31",
          },
        ],
      };
      return ageData[selectedAgeGroup] || ageData["20-30대"];
    } else if (activeTab === "성별 추천") {
      return [
        {
          id: "21",
          title: "추천 21",
          location: "전시장 U",
          date: "2026.09.01~11.30",
        },
        {
          id: "22",
          title: "추천 22",
          location: "전시장 V",
          date: "2026.10.01~12.31",
        },
        {
          id: "23",
          title: "추천 23",
          location: "전시장 W",
          date: "2026.11.01~2027.01.31",
        },
        {
          id: "24",
          title: "추천 24",
          location: "전시장 X",
          date: "2026.12.01~2027.02.28",
        },
      ];
    }
    return [];
  };

  const renderRecommendationCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.recommendationCard,
        { backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff" },
      ]}
      onPress={() => router.push(`/exhibition/${item.id}` as any)}
      activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.imagePlaceholder}>
          <Ionicons
            name='image-outline'
            size={40}
            color={theme === "dark" ? "#666" : "#ccc"}
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme === "dark" ? "#fff" : "#1c3519" },
            ]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.cardLocation,
              { color: theme === "dark" ? "#ccc" : "#666" },
            ]}>
            {item.location}
          </Text>
          <Text
            style={[
              styles.cardDate,
              { color: theme === "dark" ? "#ccc" : "#666" },
            ]}>
            {item.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    content: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "condensed",
      marginBottom: 20,
      color: theme === "dark" ? "#fff" : "#1c3519",
      textAlign: "left",
      alignSelf: "flex-start",
    },
    skeletonContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    skeletonItem: {
      width: "48%",
      marginBottom: 15,
    },
    // 탭 스타일
    tabContainer: {
      flexDirection: "row",
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#e0e0e0",
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
    },
    tabText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme === "dark" ? "#ccc" : "#666",
    },
    activeTabText: {
      color: theme === "dark" ? "#fff" : "#1c3519",
      fontWeight: "600",
    },
    activeTabIndicator: {
      position: "absolute",
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: "#4CAF50",
    },
    // 연령대 필터 스타일
    ageFilterContainer: {
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    ageFilterScrollContainer: {
      paddingHorizontal: 0,
    },
    ageFilterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 1,
      borderColor: "#4CAF50",
    },
    ageFilterButtonSelected: {
      backgroundColor: "#4CAF50",
    },
    ageFilterButtonUnselected: {
      backgroundColor: "transparent",
    },
    ageFilterText: {
      fontSize: 14,
      fontWeight: "500",
    },
    ageFilterTextSelected: {
      color: "#fff",
    },
    ageFilterTextUnselected: {
      color: "#4CAF50",
    },
    // 추천 카드 스타일
    recommendationCard: {
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardContent: {
      flexDirection: "row",
      padding: 16,
    },
    imagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#333" : "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    cardTextContainer: {
      flex: 1,
      justifyContent: "center",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    cardLocation: {
      fontSize: 14,
      marginBottom: 2,
    },
    cardDate: {
      fontSize: 12,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar />
        <ScrollView style={styles.content}>
          <Text style={styles.title}>요즘 뜨고 있는 전시</Text>
          <View style={styles.skeletonContainer}>
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 기존 콘텐츠 */}
        <Text style={styles.title}>요즘 뜨고 있는 전시</Text>
        <HorizontalSliding />

        <Text style={styles.title}>나를 위한 전시 추천</Text>
        <RecommendForYou />

        {/* 탭 네비게이션 */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* 연령대별 추천 탭일 때만 연령대 필터 표시 */}
        {activeTab === "연령대별 추천" && (
          <View style={styles.ageFilterContainer}>
            <FlatList
              data={ageGroups}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ageFilterScrollContainer}
              renderItem={({ item: ageGroup }) => (
                <TouchableOpacity
                  style={[
                    styles.ageFilterButton,
                    selectedAgeGroup === ageGroup
                      ? styles.ageFilterButtonSelected
                      : styles.ageFilterButtonUnselected,
                  ]}
                  onPress={() => setSelectedAgeGroup(ageGroup)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.ageFilterText,
                      selectedAgeGroup === ageGroup
                        ? styles.ageFilterTextSelected
                        : styles.ageFilterTextUnselected,
                    ]}>
                    {ageGroup}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        )}

        {/* 추천 카드 목록 */}
        <FlatList
          data={getRecommendationData()}
          renderItem={renderRecommendationCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}
