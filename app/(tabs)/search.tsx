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
  Pressable,
  Alert,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchResultSkeleton } from "@/components/ui/Skeleton";
import { exhibitionData } from "../../data/exhibitionsDataStorage";

const { width: screenWidth } = Dimensions.get("window");

// 임시 검색 데이터
const mockExhibitions = [
  {
    id: "1",
    title: "일본미술, 네 가지 시선",
    location: "국립중앙박물관",
    date: "2025.06.17 - 2025.08.10",
    category: "전시",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "2",
    title: "톰 삭스 전",
    location: "DDP 뮤지엄",
    date: "2025.08.01 - 2025.09.30",
    category: "전시",
    image: require("../../assets/images/exhibitionPoster/exhibition2.png"),
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

// 박물관/미술관 데이터
const museumData = {
  국립중앙박물관: {
    name: "국립중앙박물관",
    address: "서울특별시 용산구 서빙고로 137",
    phone: "02-2077-9000",
    website: "www.museum.go.kr",
    exhibitions: [
      {
        id: "1",
        title: "일본미술, 네 가지 시선",
        date: "2025.06.17 - 2025.08.10",
        image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
      },
      {
        id: "5",
        title: "한국미술 100년",
        date: "2024.04.01 - 2024.06.30",
        image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
      },
    ],
  },
  "DDP 뮤지엄": {
    name: "DDP 뮤지엄",
    address: "서울 중구 을지로 281",
    phone: "02-325-1077",
    website: "www.ddpmuseum.com",
    exhibitions: [
      {
        id: "2",
        title: "톰 삭스 전",
        date: "2025.08.01 - 2025.09.30",
        image: require("../../assets/images/exhibitionPoster/exhibition2.png"),
      },
      {
        id: "6",
        title: "디자인 특별전",
        date: "2025.10.01 - 2025.12.31",
        image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
      },
    ],
  },
  MMCA: {
    name: "국립현대미술관",
    address: "서울특별시 종로구 삼청로 30",
    phone: "02-3456-7890",
    website: "www.mmca.go.kr",
    exhibitions: [
      {
        id: "4",
        title: "현대미술 특별전",
        date: "2024.01.20 - 2024.05.20",
        image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
      },
      {
        id: "7",
        title: "현대조각전",
        date: "2025.03.01 - 2025.06.30",
        image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
      },
    ],
  },
  서울시립미술관: {
    name: "서울시립미술관",
    address: "서울특별시 중구 덕수궁길 61",
    phone: "02-2345-6789",
    website: "www.sema.seoul.go.kr",
    exhibitions: [
      {
        id: "8",
        title: "반 고흐 생애전",
        date: "2024.03.01 - 2024.05.15",
        image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
      },
    ],
  },
};

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState<any>(null);
  const router = useRouter();

  // 애니메이션 값들
  const searchInputScale = useRef(new Animated.Value(1)).current;
  const searchContainerOpacity = useRef(new Animated.Value(0)).current;
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const searchIconRotation = useRef(new Animated.Value(0)).current;

  // 검색 기록 로드
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // 검색 기록 렌더링 디버깅
  useEffect(() => {
    if (showHistory && searchHistory.length > 0) {
      console.log("🔄 검색 기록 렌더링 시작, 개수:", searchHistory.length);
      searchHistory.forEach((item, index) => {
        console.log(`📝 렌더링 중인 검색 기록 ${index}:`, item);
      });
    }
  }, [showHistory, searchHistory]);

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

  // 검색 기록 로드 함수
  const loadSearchHistory = async () => {
    try {
      console.log("📚 === 검색 기록 로드 시작 ===");
      const history = await AsyncStorage.getItem("search_history");
      console.log("💾 AsyncStorage에서 가져온 데이터:", history);

      if (history) {
        const parsedHistory = JSON.parse(history);
        console.log("📋 파싱된 검색 기록:", parsedHistory);
        console.log("📊 검색 기록 개수:", parsedHistory.length);
        setSearchHistory(parsedHistory);
      } else {
        console.log("📭 저장된 검색 기록 없음");
        setSearchHistory([]);
      }
    } catch (error) {
      console.log("❌ 검색 기록 로드 실패:", error);
    }
  };

  // 검색 기록 저장 함수
  const saveSearchHistory = async (query: string) => {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      const currentHistory = [...searchHistory];
      // 중복 제거
      const filteredHistory = currentHistory.filter(
        (item) => item !== trimmedQuery
      );
      // 최신 검색어를 맨 앞에 추가
      const newHistory = [trimmedQuery, ...filteredHistory].slice(0, 10); // 최대 10개만 저장

      await AsyncStorage.setItem("search_history", JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    } catch (error) {
      console.log("검색 기록 저장 실패:", error);
    }
  };

  // 검색 기록 삭제 함수
  const deleteSearchHistory = async (queryToDelete: string) => {
    try {
      const newHistory = searchHistory.filter((item) => item !== queryToDelete);
      await AsyncStorage.setItem("search_history", JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    } catch (error) {
      console.log("검색 기록 삭제 실패:", error);
    }
  };

  // 검색 기록 전체 삭제 함수
  const clearAllSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem("search_history");
      setSearchHistory([]);
    } catch (error) {
      console.log("검색 기록 전체 삭제 실패:", error);
    }
  };

  // 검색 입력 포커스 애니메이션
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowHistory(true);
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
    // 검색 기록 클릭을 위해 지연 시간을 늘림
    setTimeout(() => setShowHistory(false), 500);
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
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    // setShowHistory(false) 제거 - 검색 기록창 유지

    // 박물관/미술관 검색
    const foundMuseum = Object.values(museumData).find(
      (museum) =>
        museum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        museum.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundMuseum) {
      setSelectedMuseum(foundMuseum);
      setSearchResults([]);
    } else {
      // 일반 전시 검색
      setSelectedMuseum(null);
      const allExhibitions = Object.values(exhibitionData);
      const filteredResults = allExhibitions.filter(
        (exhibition: any) =>
          exhibition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exhibition.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // 검색 실행 함수
  const executeSearch = (query: string) => {
    console.log("🚀 === executeSearch 함수 시작 ===");
    console.log("📝 받은 검색어:", query);
    console.log("📱 현재 searchQuery 상태:", searchQuery);
    console.log("⏰ 함수 호출 시간:", new Date().toLocaleTimeString());

    // 상태 업데이트
    setSearchQuery(query);
    saveSearchHistory(query);

    console.log("✅ 상태 업데이트 완료");

    // 즉시 검색 실행
    setIsLoading(true);
    // setShowHistory(false) 제거 - 검색 기록창 유지

    console.log("🔄 로딩 상태 설정 완료");

    // 박물관/미술관 검색
    console.log("🏛️ 박물관/미술관 검색 시작");
    const foundMuseum = Object.values(museumData).find(
      (museum) =>
        museum.name.toLowerCase().includes(query.toLowerCase()) ||
        museum.address.toLowerCase().includes(query.toLowerCase())
    );

    console.log("🏛️ 찾은 박물관:", foundMuseum ? foundMuseum.name : "없음");

    if (foundMuseum) {
      console.log("🏛️ 박물관 검색 결과 설정");
      setSelectedMuseum(foundMuseum);
      setSearchResults([]);
    } else {
      console.log("🎨 일반 전시 검색 시작");
      // 일반 전시 검색
      setSelectedMuseum(null);
      const allExhibitions = Object.values(exhibitionData);
      console.log("📊 전체 전시회 수:", allExhibitions.length);

      const filteredResults = allExhibitions.filter(
        (exhibition: any) =>
          exhibition.title.toLowerCase().includes(query.toLowerCase()) ||
          exhibition.location.toLowerCase().includes(query.toLowerCase())
      );

      console.log("🔍 필터링된 결과 수:", filteredResults.length);
      console.log(
        "📋 필터링된 결과 제목들:",
        filteredResults.map((item: any) => item.title)
      );

      setSearchResults(filteredResults);
      console.log("✅ 검색 결과 설정 완료");
    }

    setTimeout(() => {
      console.log("⏰ 로딩 완료");
      setIsLoading(false);
      console.log("🎉 검색 프로세스 완료!");
    }, 1000);
  };

  // 검색 결과 아이템 렌더링
  const renderSearchResult = ({
    item,
    index,
  }: {
    item: any;
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
          onPress={(e) => {
            // 이벤트 전파 방지
            e?.stopPropagation?.();
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

  const renderMuseumInfo = () => {
    if (!selectedMuseum) return null;

    return (
      <View style={styles.museumContainer}>
        <TouchableOpacity
          style={styles.museumButton}
          onPress={(e) => {
            // 이벤트 전파 방지
            e?.stopPropagation?.();
            // 박물관 상세 페이지로 이동하거나 추가 정보 표시
            console.log("박물관 상세 정보:", selectedMuseum.name);
          }}
          activeOpacity={0.7}>
          <View style={styles.museumHeader}>
            <Image
              source={require("../../assets/images/exhibitionPoster/exhibition1.png")}
              style={styles.museumImage}
            />
            <View style={styles.museumInfo}>
              <Text style={styles.museumName}>{selectedMuseum.name}</Text>
              <Text style={styles.museumAddress}>{selectedMuseum.address}</Text>
              <Text style={styles.museumPhone}>{selectedMuseum.phone}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.exhibitionSectionTitle}>
          현재 전시 ({selectedMuseum.exhibitions.length}개)
        </Text>

        {selectedMuseum.exhibitions.map((exhibition: any) => (
          <TouchableOpacity
            key={exhibition.id}
            style={styles.exhibitionItem}
            onPress={(e) => {
              // 이벤트 전파 방지
              e?.stopPropagation?.();
              router.push(`/exhibition/${exhibition.id}` as any);
            }}
            activeOpacity={0.7}>
            <Image
              source={exhibition.image}
              style={styles.exhibitionImage}
            />
            <View style={styles.exhibitionInfo}>
              <Text style={styles.exhibitionTitle}>{exhibition.title}</Text>
              <Text style={styles.exhibitionDate}>{exhibition.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
    historyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#444" : "#e0e0e0",
      minHeight: 50,
    },
    historyContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    historyText: {
      marginLeft: 8,
      fontSize: 14,
    },
    historyContainer: {
      marginTop: 20,
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    historyTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    museumContainer: {
      marginTop: 20,
    },
    museumButton: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    museumHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    museumImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 16,
    },
    museumInfo: {
      flex: 1,
      justifyContent: "center",
    },
    museumName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 4,
    },
    museumAddress: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      marginBottom: 2,
    },
    museumPhone: {
      fontSize: 12,
      color: theme === "dark" ? "#ccc" : "#666",
    },
    exhibitionSectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 10,
    },
    exhibitionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#eee",
    },
    exhibitionImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 15,
    },
    exhibitionInfo: {
      flex: 1,
    },
    exhibitionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 2,
    },
    exhibitionDate: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
    },
    deleteButton: {
      padding: 8,
      borderRadius: 4,
      backgroundColor: theme === "dark" ? "#444" : "#f0f0f0",
      minWidth: 32,
      minHeight: 32,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowHistory(true);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // 키보드만 내리고 검색 기록창은 유지
        Keyboard.dismiss();
        // 검색 기록창이 열려있고 검색어가 비어있다면 유지
        if (showHistory || searchQuery.trim() === "") {
          // 아무것도 하지 않음 - 검색 기록창 유지
        }
      }}>
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
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                returnKeyType='search'
                autoCapitalize='none'
                autoCorrect={false}
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    executeSearch(searchQuery);
                  }
                }}
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

          {/* 로딩 상태 */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <SearchResultSkeleton />
            </View>
          )}

          {/* 검색 기록 */}
          {showHistory && searchHistory.length > 0 ? (
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text
                  style={[
                    styles.historyTitle,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  최근 검색어 ({searchHistory.length}개)
                </Text>
                <TouchableOpacity
                  onPress={clearAllSearchHistory}
                  activeOpacity={0.7}>
                  <Text
                    style={{
                      color: theme === "dark" ? "#ccc" : "#666",
                      fontSize: 12,
                    }}>
                    전체 삭제
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>
                {searchHistory.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => {
                      console.log("🔍 === 검색 기록 클릭됨! ===");
                      console.log("📝 클릭된 검색어:", item);

                      // 검색어 설정
                      setSearchQuery(item);

                      // 검색 기록창 유지
                      setShowHistory(true);

                      // 즉시 검색 실행
                      executeSearch(item);
                    }}
                    activeOpacity={0.7}>
                    <View style={styles.historyContent}>
                      <Ionicons
                        name='time-outline'
                        size={16}
                        color={theme === "dark" ? "#ccc" : "#666"}
                      />
                      <Text
                        style={[
                          styles.historyText,
                          { color: theme === "dark" ? "#fff" : "#1c3519" },
                        ]}>
                        {item}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={(e) => {
                        // 이벤트 버블링 방지
                        e.stopPropagation();

                        console.log("🗑️ === 삭제 버튼 클릭 ===");
                        deleteSearchHistory(item);
                      }}
                      activeOpacity={0.7}>
                      <Ionicons
                        name='close'
                        size={16}
                        color={theme === "dark" ? "#ccc" : "#666"}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* 검색 결과 */}
          {!isLoading && (selectedMuseum || searchResults.length > 0) && (
            <Animated.View
              style={[styles.resultsContainer, { opacity: resultsOpacity }]}>
              {selectedMuseum
                ? renderMuseumInfo()
                : searchResults.length > 0 && (
                    <FlatList
                      data={searchResults}
                      renderItem={renderSearchResult}
                      keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 20 }}
                      keyboardShouldPersistTaps='handled'
                    />
                  )}
            </Animated.View>
          )}

          {/* 검색 결과가 없을 때만 빈 상태 표시 */}
          {!isLoading &&
            !selectedMuseum &&
            searchResults.length === 0 &&
            searchQuery.trim().length > 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name='search-outline'
                  size={60}
                  color={theme === "dark" ? "#ccc" : "#666"}
                />
                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
              </View>
            )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}
