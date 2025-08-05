import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function CategoryScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("지역별");

  const tabs = ["지역별", "성격별"];

  // 지역별 데이터
  const regionData = [
    "강남, 서초, 양재",
    "잠실, 송파, 강동",
    "동작, 관악, 사당",
    "마포, 서대문, 은평",
    "강북, 노원, 도봉",
    "성북, 중랑, 광진",
    "용산, 중구, 종로",
    "영등포, 강서, 양천",
  ];

  // 성격별 데이터
  const personalityData = ["차분한", "역동적인", "로맨틱한", "고전적인"];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginTop: 20,
      marginBottom: 30,
    },
    // 탭 스타일
    tabContainer: {
      flexDirection: "row",
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#e0e0e0",
    },
    tab: {
      flex: 1,
      paddingVertical: 15,
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
      backgroundColor: "#1c3519",
    },
    // 카테고리 항목 스타일
    categoryItem: {
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#f0f0f0",
    },
    categoryText: {
      fontSize: 16,
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
  });

  const renderCategoryItem = (item: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.categoryItem}
      activeOpacity={0.7}>
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>카테고리</Text>

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

        {/* 카테고리 목록 */}
        {activeTab === "지역별"
          ? regionData.map((item, index) => renderCategoryItem(item, index))
          : personalityData.map((item, index) =>
              renderCategoryItem(item, index)
            )}
      </ScrollView>
    </View>
  );
}
