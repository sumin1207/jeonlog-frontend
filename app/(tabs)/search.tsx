import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

// 임시 검색 데이터
const mockExhibitions = [
  {
    id: "1",
    title: "일본미술, 네 가지 시선",
    location: "국립중앙박물관",
    date: "2024.01.15 - 2024.03.15",
    category: "전시",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "2",
    title: "모네 특별전",
    location: "서울시립미술관",
    date: "2024.02.01 - 2024.04.30",
    category: "전시",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "4",
    title: "현대미술 특별전",
    location: "MMCA",
    date: "2024.01.20 - 2024.05.20",
    category: "전시",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
];

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(mockExhibitions);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 애니메이션 값들
  const searchInputScale = useRef(new Animated.Value(1)).current;
  const searchContainerOpacity = useRef(new Animated.Value(0)).current;
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const searchIconRotation = useRef(new Animated.Value(0)).current;

  // 컴포넌트 마운트 시 애니메이션
  useEffect(() => {
    Animated.parallel([
      Animated.timing(searchContainerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(resultsOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 검색 입력 포커스 애니메이션
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    Animated.parallel([
      Animated.timing(searchInputScale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 검색 입력 블러 애니메이션
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    Animated.parallel([
      Animated.timing(searchInputScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(searchIconRotation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 검색 및 필터링 함수
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsLoading(true);

    // 로딩 시뮬레이션
    setTimeout(() => {
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
      setIsLoading(false);
    }, 300);
  }, []);

  // 검색 결과 아이템 렌더링
  const renderSearchResult = ({
    item,
    index,
  }: {
    item: (typeof mockExhibitions)[0];
    index: number;
  }) => {
    return (
      <Animated.View
        style={{
          opacity: resultsOpacity,
          transform: [
            {
              translateY: resultsOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}>
        <TouchableOpacity
          style={[
            styles.resultItem,
            { backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff" },
          ]}
          onPress={() => {
            router.push(`/exhibition/${item.id}` as any);
          }}
          activeOpacity={0.7}>
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
      </Animated.View>
    );
  };

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
      alignItems: "center",
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      maxWidth: screenWidth * 0.9,
    },
    searchInput: {
      flex: 1,
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
      borderWidth: isSearchFocused ? 2 : 0,
      borderColor: "#1c3519",
    },
    searchIcon: {
      position: "absolute",
      right: 15,
      zIndex: 1,
    },
    clearButton: {
      position: "absolute",
      right: 15,
      zIndex: 1,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 16,
      color: theme === "dark" ? "#ccc" : "#666",
      marginTop: 10,
    },
  });

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(mockExhibitions);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TopBar />
        <Animated.View
          style={[styles.content, { opacity: searchContainerOpacity }]}>
          {/* 검색바 */}
          <View style={styles.searchContainer}>
            <Animated.View
              style={[
                styles.searchInputContainer,
                { transform: [{ scale: searchInputScale }] },
              ]}>
              <TextInput
                style={styles.searchInput}
                placeholder='전시를 검색해보세요'
                placeholderTextColor={theme === "dark" ? "#999" : "#999"}
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                returnKeyType='search'
                autoCapitalize='none'
                autoCorrect={false}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSearch}
                  activeOpacity={0.7}>
                  <Ionicons
                    name='close-circle'
                    size={20}
                    color={theme === "dark" ? "#ccc" : "#666"}
                  />
                </TouchableOpacity>
              ) : (
                <Animated.View
                  style={[
                    styles.searchIcon,
                    {
                      transform: [
                        {
                          rotate: searchIconRotation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "90deg"],
                          }),
                        },
                      ],
                    },
                  ]}>
                  <Ionicons
                    name='search'
                    size={20}
                    color={theme === "dark" ? "#ccc" : "#666"}
                  />
                </Animated.View>
              )}
            </Animated.View>
          </View>

          {/* 검색 결과 */}
          <Animated.View
            style={[styles.resultsContainer, { opacity: resultsOpacity }]}>
            <Text style={styles.resultsTitle}>
              검색 결과 ({searchResults.length}개)
            </Text>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: searchIconRotation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  }}>
                  <Ionicons
                    name='search'
                    size={40}
                    color={theme === "dark" ? "#ccc" : "#666"}
                  />
                </Animated.View>
                <Text style={styles.loadingText}>검색 중...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps='handled'
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name='search-outline'
                  size={60}
                  color={theme === "dark" ? "#ccc" : "#666"}
                />
                <Text style={styles.emptyText}>
                  {searchQuery.trim()
                    ? "검색 결과가 없습니다."
                    : "검색어를 입력해보세요."}
                </Text>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}
