import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import HorizontalSliding from "@/components/exhibition/HorizontalSliding";
import RecommendForYou from "@/components/exhibition/RecommendForYou";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../components/context/AuthContext";
import { ExhibitionCardSkeleton } from "@/components/ui/Skeleton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { style as getThemedStyle } from "./Home.styles"; // Import styles from Home.styles.ts
import { Colors } from "@/design-system/theme";
import { Spacing } from "@/design-system/theme";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { isLoggedIn, userInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("20-30대");
  const router = useRouter();
  const style = getThemedStyle(theme); // Get styles based on the current theme
  const scrollY = useRef(new Animated.Value(0)).current;

  // AuthContext 상태 확인
  useEffect(() => {
    console.log(
      "🔍 Home: AuthContext 상태 - isLoggedIn:",
      isLoggedIn,
      "userInfo:",
      userInfo
    );
  }, [isLoggedIn, userInfo]);

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
    //mock data (나중에 실제 데이터로 교체)
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
        ],
        "20-30대": [
          {
            id: "8",
            title: "추천 8",
            location: "전시장 H",
            date: "2025.08.01~10.31",
          },
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
        ],
        "40-50대": [
          {
            id: "11",
            title: "추천 11",
            location: "전시장 K",
            date: "2026.01.01~03.31",
          },
          {
            id: "12",
            title: "추천 12",
            location: "전시장 L",
            date: "2026.02.01~04.30",
          },
          {
            id: "13",
            title: "추천 13",
            location: "전시장 M",
            date: "2026.03.01~05.31",
          },
        ],
        "60대 이상": [
          {
            id: "14",
            title: "추천 14",
            location: "전시장 N",
            date: "2026.04.01~06.30",
          },
          {
            id: "15",
            title: "추천 15",
            location: "전시장 O",
            date: "2026.05.01~07.31",
          },
          {
            id: "16",
            title: "추천 16",
            location: "전시장 P",
            date: "2026.06.01~08.31",
          },
        ],
      };
      return ageData[selectedAgeGroup] || [];
    } else if (activeTab === "성별 추천") {
      return [
        {
          id: "17",
          title: "추천 17",
          location: "전시장 Q",
          date: "2026.07.01~09.30",
        },
        {
          id: "18",
          title: "추천 18",
          location: "전시장 R",
          date: "2026.08.01~10.31",
        },
        {
          id: "19",
          title: "추천 19",
          location: "전시장 S",
          date: "2026.09.01~11.30",
        },
        {
          id: "20",
          title: "추천 20",
          location: "전시장 T",
          date: "2026.10.01~12.31",
        },
        {
          id: "21",
          title: "추천 21",
          location: "전시장 U",
          date: "2026.11.01~2027.01.31",
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
        style.recommendationCard,
        {
          backgroundColor:
            theme === "dark"
              ? Colors.background.cardDark
              : Colors.background.card,
        },
      ]}
      onPress={() => router.push(`/exhibition/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={style.cardContent}>
        <View style={style.imagePlaceholder}>
          <Ionicons
            name="image-outline"
            size={40}
            color={
              theme === "dark" ? Colors.neutral.gray600 : Colors.neutral.gray300
            }
          />
        </View>
        <View style={style.cardTextContainer}>
          <Text
            style={[
              style.cardTitle,
              {
                color:
                  theme === "dark"
                    ? Colors.text.dark.primary
                    : Colors.text.primary,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              style.cardLocation,
              {
                color:
                  theme === "dark"
                    ? Colors.text.dark.secondary
                    : Colors.text.secondary,
              },
            ]}
          >
            {item.location}
          </Text>
          <Text
            style={[
              style.cardDate,
              {
                color:
                  theme === "dark"
                    ? Colors.text.dark.secondary
                    : Colors.text.secondary,
              },
            ]}
          >
            {item.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const topBarOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const topBarTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });

  return (
    <View style={style.container}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            opacity: topBarOpacity,
            transform: [{ translateY: topBarTranslateY }],
          },
        ]}
      >
        <TopBar />
      </Animated.View>
      <Animated.ScrollView
        style={style.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: Spacing.xxl }}
      >
        {/* 기존 콘텐츠 */}
        <Text style={style.title1}>나를 위한 전시 추천</Text>
        <RecommendForYou />
        <Text style={style.title1}>요즘 뜨고 있는 전시</Text>
        <HorizontalSliding />

        <Text style={style.title2}>전시 둘러보기</Text>
        {/* 탭 네비게이션 */}
        <View style={style.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={style.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  style.tabText,
                  activeTab === tab && style.activeTabText,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={style.activeTabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* 연령대별 추천 탭일 때만 연령대 필터 표시 */}
        {activeTab === "연령대별 추천" && (
          <View style={style.ageFilterContainer}>
            <FlatList
              data={ageGroups}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={style.ageFilterScrollContainer}
              renderItem={({ item: ageGroup }) => (
                <TouchableOpacity
                  style={[
                    style.ageFilterButton,
                    selectedAgeGroup === ageGroup
                      ? style.ageFilterButtonSelected
                      : style.ageFilterButtonUnselected,
                  ]}
                  onPress={() => setSelectedAgeGroup(ageGroup)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      style.ageFilterText,
                      selectedAgeGroup === ageGroup
                        ? style.ageFilterTextSelected
                        : style.ageFilterTextUnselected,
                    ]}
                  >
                    {ageGroup}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        )}

        {/* 추천 카드 목록 */}
        <View style={{ marginTop: Spacing.md }}>
          <FlatList
            data={getRecommendationData()}
            renderItem={renderRecommendationCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}