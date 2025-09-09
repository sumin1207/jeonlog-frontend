import { View, Text, TouchableOpacity, FlatList, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import HorizontalSliding from "@/components/exhibition/HorizontalSliding";
import RecommendForYou from "@/components/exhibition/RecommendForYou";
import AgeRecommendations from "@/components/exhibition/AgeRecommendations";
import GenderRecommendations from "@/components/exhibition/GenderRecommendations";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "expo-router";
import { style as getThemedStyle } from "./Home.styles";
import { Colors } from "@/design-system/theme";
import { Spacing } from "@/design-system/theme";
import {
  getRecommendation,
  getPopularRecommendations,
  getAgeRecommendations,
  getGenderRecommendations,
} from "../../services/recommendationServices";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("20-30대");
  const router = useRouter();
  const style = getThemedStyle(theme);
  const scrollY = useRef(new Animated.Value(0)).current;

  // 추천 데이터 상태
  const [personalRecommendations, setPersonalRecommendations] = useState([]);
  const [popularRecommendations, setPopularRecommendations] = useState([]);
  const [ageRecommendations, setAgeRecommendations] = useState([]);
  const [genderRecommendations, setGenderRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // 추천 데이터 가져오기
  const fetchRecommendations = async () => {
    setRecommendationsLoading(true);
    try {
      const [personal, popular, age, gender] = await Promise.all([
        getRecommendation(),
        getPopularRecommendations(),
        getAgeRecommendations(),
        getGenderRecommendations(),
      ]);

      setPersonalRecommendations(personal);
      setPopularRecommendations(popular);
      setAgeRecommendations(age);
      setGenderRecommendations(gender);
    } catch (error) {
      console.error("추천 데이터 로딩 실패:", error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  useEffect(() => {
    // 추천 데이터 로딩
    fetchRecommendations();
  }, []);

  const tabs = ["전체", "연령대별 추천", "성별 추천"];
  const ageGroups = ["10대", "20-30대", "40-50대", "60대 이상"];

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
        ]}>
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
        contentContainerStyle={{ paddingTop: 80, paddingBottom: Spacing.xxl }}>
        {/* 기존 콘텐츠 */}
        <Text style={style.title1}>나를 위한 전시 추천</Text>
        <RecommendForYou
          data={personalRecommendations}
          loading={recommendationsLoading}
        />
        <Text style={style.title1}>요즘 뜨고 있는 전시</Text>
        <HorizontalSliding
          data={popularRecommendations}
          loading={recommendationsLoading}
        />

        <Text style={style.title2}>전시 둘러보기</Text>
        {/* 탭 네비게이션 */}
        <View style={style.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={style.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}>
              <Text
                style={[
                  style.tabText,
                  activeTab === tab && style.activeTabText,
                ]}>
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
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      style.ageFilterText,
                      selectedAgeGroup === ageGroup
                        ? style.ageFilterTextSelected
                        : style.ageFilterTextUnselected,
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
        <View style={{ marginTop: Spacing.md }}>
          {activeTab === "전체" && (
            <RecommendForYou
              data={personalRecommendations}
              loading={recommendationsLoading}
            />
          )}
          {activeTab === "연령대별 추천" && (
            <AgeRecommendations
              data={ageRecommendations}
              loading={recommendationsLoading}
            />
          )}
          {activeTab === "성별 추천" && (
            <GenderRecommendations
              data={genderRecommendations}
              loading={recommendationsLoading}
            />
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
