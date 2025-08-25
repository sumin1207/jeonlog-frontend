import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { Text, Container, Row } from "../../design-system";
import { CategoryStyles } from "../../design-system/styles";

export default function CategoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("지역별");

  const tabs = ["지역별", "장르별", "성향별"];

  const regionData = [
    "강남, 서초, 송파",
    "동작, 관악, 사당",
    "마포, 서대문, 은평",
    "강북, 노원, 도봉",
    "성북, 중랑, 광진",
    "용산, 중구, 종로",
    "영등포, 강서, 양천",
  ];

  const genreData = [
    "회화",
    "조각",
    "설치",
    "미디어아트",
    "사진",
    "공예",
    "건축",
    "디자인",
  ];

  const personalityData = [
    "감성적",
    "지적",
    "실용적",
    "창의적",
    "전통적",
    "현대적",
    "자연친화적",
    "도시적",
  ];

  const handleCategoryPress = (categoryName: string) => {
    const type = activeTab === "지역별" ? "region" : "personality";
    router.push(
      `/(tabs)/category/${type}?category=${encodeURIComponent(
        categoryName
      )}` as any
    );
  };

  const renderCategoryButton = (categoryName: string) => (
    <TouchableOpacity
      key={categoryName}
      style={CategoryStyles.categoryButton}
      onPress={() => handleCategoryPress(categoryName)}
      activeOpacity={0.7}>
      <Text style={CategoryStyles.categoryText}>{categoryName}</Text>
    </TouchableOpacity>
  );

  const currentData =
    activeTab === "지역별"
      ? regionData
      : activeTab === "장르별"
      ? genreData
      : personalityData;

  return (
    <Container style={CategoryStyles.container}>
      <ScrollView style={CategoryStyles.content}>
        <Text style={CategoryStyles.title}>카테고리</Text>

        {/* 탭 네비게이션 */}
        <View style={CategoryStyles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={CategoryStyles.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}>
              <Text
                style={{
                  ...CategoryStyles.tabText,
                  ...(activeTab === tab ? CategoryStyles.activeTabText : {}),
                }}>
                {tab}
              </Text>
              {activeTab === tab && (
                <View style={CategoryStyles.activeTabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 카테고리 버튼들 */}
        {currentData.map(renderCategoryButton)}
      </ScrollView>
    </Container>
  );
}
