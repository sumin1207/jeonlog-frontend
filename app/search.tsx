import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";

// 임시 검색 데이터
const mockExhibitions = [
  {
    id: "1",
    title: "일본미술, 네 가지 시선",
    location: "국립중앙박물관",
    date: "2024.01.15 - 2024.03.15",
    category: "전시",
    image: require("../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "2",
    title: "모네 특별전",
    location: "서울시립미술관",
    date: "2024.02.01 - 2024.04.30",
    category: "전시",
    image: require("../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "4",
    title: "현대미술 특별전",
    location: "MMCA",
    date: "2024.01.20 - 2024.05.20",
    category: "전시",
    image: require("../assets/images/exhibitionPoster/exhibition1.png"),
  },
];

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(mockExhibitions);
  const router = useRouter();

  // 검색 및 필터링 함수
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    let filtered = mockExhibitions;

    // 검색어 필터링
    if (query.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    setSearchResults(filtered);
  }, []);

  // 검색 결과 아이템 렌더링
  const renderSearchResult = ({
    item,
  }: {
    item: (typeof mockExhibitions)[0];
  }) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        { backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff" },
      ]}
      onPress={() => {
        router.push(`/exhibition/${item.id}` as any);
      }}>
      <View style={styles.resultImage}>
        <Image
          source={item.image}
          style={styles.imagePlaceholder}
          resizeMode='cover'
        />
      </View>
      <View style={styles.resultInfo}>
        <View style={styles.resultHeader}>
          <Text
            style={[
              styles.resultTitle,
              { color: theme === "dark" ? "#fff" : "#1c3519" },
            ]}>
            {item.title}
          </Text>
          <View
            style={[
              styles.categoryTag,
              {
                backgroundColor: "#4CAF50",
              },
            ]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.resultLocation,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}>
          📍 {item.location}
        </Text>
        <Text
          style={[
            styles.resultDate,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}>
          📅 {item.date}
        </Text>
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
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    searchContainer: {
      marginBottom: 20,
    },
    searchInput: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 15,
      fontSize: 16,
      color: theme === "dark" ? "#fff" : "#1c3519",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    resultsContainer: {
      flex: 1,
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 15,
    },
    resultItem: {
      flexDirection: "row",
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    resultImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    imagePlaceholder: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    resultInfo: {
      flex: 1,
      justifyContent: "center",
    },
    resultHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
      marginRight: 8,
    },
    categoryTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "600",
    },
    resultLocation: {
      fontSize: 14,
      marginBottom: 2,
    },
    resultDate: {
      fontSize: 14,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: theme === "dark" ? "#ccc" : "#666",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        {/* 검색바 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder='전시를 검색해보세요'
            placeholderTextColor={theme === "dark" ? "#999" : "#999"}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* 검색 결과 */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            검색 결과 ({searchResults.length}개)
          </Text>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? "검색 결과가 없습니다."
                  : "검색어를 입력해보세요."}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
