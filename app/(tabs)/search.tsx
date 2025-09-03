import React, { useState, useCallback, useRef, useEffect } from "react";
import { SafeAreaView, View, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "../../data/exhibitionsDataStorage";
import searchService from "../../services/searchService";
import { Text, Container } from "../../design-system";
import { SearchStyles } from "../../design-system/styles";
import TopBar from "@/components/ui/TopBar";

// 인기 검색어 데이터
const popularSearchTerms = [
  "모다갤러리",
  "미셀 앙리",
  "위대한 컬러리스트",
  "캐서린 번하드전",
  "톰삭스전",
  "카포디몬테",
  "김창열",
  "요하네스버그",
  "마르크샤갈 특별전",
  "요시고 사진전",
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
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [exhibitionResults, setExhibitionResults] = useState<any[]>([]);
  const [exhibitionError, setExhibitionError] = useState<string | null>(null);

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

  // 검색 입력 포커스 처리
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowHistory(true);
  };

  // 검색 입력 블러 처리
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // 검색 기록 클릭을 위해 지연 시간을 늘림
    setTimeout(() => setShowHistory(false), 500);
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

  // 검색 실행 함수 (API 호출 통합)
  const executeSearch = (query: string) => {
    console.log("🚀 === executeSearch 함수 시작 ===");
    console.log("📝 받은 검색어:", query);
    console.log("📱 현재 searchQuery 상태:", searchQuery);
    console.log("⏰ 함수 호출 시간:", new Date().toLocaleTimeString());

    // 상태 업데이트
    setSearchQuery(query);
    saveSearchHistory(query);

    console.log("✅ 상태 업데이트 완료");

    // 전시회 검색 API 실행
    fetchExhibitionSearchResults(query);
  };

  // 검색 실행 함수 예시 (검색어로 API 호출)
  const fetchSearchResults = async (query: string) => {
    setApiError(null);
    setApiResults([]);
    setIsLoading(true);
    try {
      const res = await searchService.get("/search", { params: { query } });
      setApiResults(res.data.result);
    } catch (err: any) {
      if (err.response) {
        setApiError(`${err.response.status} - ${err.response.data.error}`);
      } else {
        setApiError("네트워크 오류");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 전시회 검색 API 호출 함수
  const fetchExhibitionSearchResults = async (query: string) => {
    setExhibitionError(null);
    setExhibitionResults([]);
    setIsLoading(true);
    try {
      console.log("🔍 전시회 검색 API 호출 시작:", query);
      const res = await searchService.get("/exhibitions/search", {
        params: { query },
      });
      console.log("✅ 전시회 검색 API 응답:", res.data);

      if (res.data.success && res.data.data) {
        setExhibitionResults(res.data.data);
        console.log("📊 전시회 검색 결과 개수:", res.data.data.length);
      } else {
        setExhibitionError("검색 결과를 가져올 수 없습니다.");
      }
    } catch (err: any) {
      console.log("❌ 전시회 검색 API 오류:", err);
      if (err.response) {
        setExhibitionError(
          `${err.response.status} - ${err.response.data?.error || "서버 오류"}`
        );
      } else {
        setExhibitionError("네트워크 오류");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 페이지 초기화 함수
  const resetSearchPage = () => {
    setSearchQuery("");
    setSearchResults([]);
    setApiResults([]);
    setApiError(null);
    setExhibitionResults([]);
    setExhibitionError(null);
    setIsLoading(false);
    setIsSearchFocused(false);
    setShowHistory(false);
    setSelectedMuseum(null);
  };

  // 예시: 검색어 입력 후 검색 실행
  // 기존 executeSearch 함수 내에 아래 코드 추가
  // fetchSearchResults(query);

  return (
    <SafeAreaView style={SearchStyles.container}>
      {/* 검색 입력 필드 */}
      <View style={SearchStyles.searchInputSection}>
        <TouchableOpacity
          style={SearchStyles.backButton}
          onPress={() => router.push("/(tabs)/home")}>
          <Ionicons
            name='arrow-back'
            size={24}
            color='#666'
          />
        </TouchableOpacity>
        <View style={SearchStyles.searchInputContainer}>
          <TextInput
            style={SearchStyles.searchInput}
            placeholder='관심있는 전시를 검색해보세요'
            placeholderTextColor='#999'
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            returnKeyType='search'
            autoCapitalize='none'
            autoCorrect={false}
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                setIsSearchFocused(false);
                setShowHistory(false);
                executeSearch(searchQuery);
              }
            }}
          />
          <Ionicons
            name='search'
            size={20}
            color='#999'
            style={SearchStyles.searchInputIcon}
          />
        </View>
      </View>

      {/* 인기 검색어 섹션 */}
      <View style={SearchStyles.popularSection}>
        <Text style={SearchStyles.popularTitle}>인기 검색어</Text>
        <View style={SearchStyles.popularDivider} />
        <View style={SearchStyles.popularGrid}>
          {/* 왼쪽 컬럼 (1-5번) */}
          <View style={SearchStyles.popularColumn}>
            {popularSearchTerms.slice(0, 5).map((term, index) => (
              <TouchableOpacity
                key={index}
                style={SearchStyles.popularItem}
                onPress={() => {
                  setSearchQuery(term);
                  executeSearch(term);
                }}>
                <Text style={SearchStyles.popularNumber}>{index + 1}.</Text>
                <Text style={SearchStyles.popularText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 오른쪽 컬럼 (6-10번) */}
          <View style={SearchStyles.popularColumn}>
            {popularSearchTerms.slice(5, 10).map((term, index) => (
              <TouchableOpacity
                key={index + 5}
                style={SearchStyles.popularItem}
                onPress={() => {
                  setSearchQuery(term);
                  executeSearch(term);
                }}>
                <Text style={SearchStyles.popularNumber}>{index + 6}.</Text>
                <Text style={SearchStyles.popularText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 전시회 검색 결과 표시 */}
      {exhibitionResults.length > 0 && (
        <View style={SearchStyles.resultsSection}>
          <Text style={SearchStyles.resultsTitle}>
            전시회 검색 결과 ({exhibitionResults.length}개)
          </Text>
          {exhibitionResults.map((exhibition, index) => (
            <TouchableOpacity
              key={exhibition.id || index}
              style={SearchStyles.resultItem}
              onPress={() => {
                console.log("전시회 검색 결과 클릭:", exhibition);
                // 전시회 상세 페이지로 이동
                router.push(`/exhibition/${exhibition.id}`);
              }}>
              <View style={SearchStyles.exhibitionCard}>
                <View style={SearchStyles.exhibitionInfo}>
                  <Text style={SearchStyles.resultTitle}>
                    {exhibition.title}
                  </Text>
                  {exhibition.description && (
                    <Text style={SearchStyles.resultDescription}>
                      {exhibition.description}
                    </Text>
                  )}
                  <View style={SearchStyles.exhibitionDetails}>
                    {exhibition.location && (
                      <Text style={SearchStyles.resultLocation}>
                        📍 {exhibition.location}
                      </Text>
                    )}
                    {exhibition.startDate && exhibition.endDate && (
                      <Text style={SearchStyles.resultDate}>
                        📅 {exhibition.startDate} - {exhibition.endDate}
                      </Text>
                    )}
                    {exhibition.price && (
                      <Text style={SearchStyles.resultPrice}>
                        💰 {exhibition.price}
                      </Text>
                    )}
                    {exhibition.operatingHours && (
                      <Text style={SearchStyles.resultHours}>
                        🕒 {exhibition.operatingHours}
                      </Text>
                    )}
                  </View>
                  <View style={SearchStyles.exhibitionActions}>
                    <View style={SearchStyles.likeSection}>
                      <Ionicons
                        name={exhibition.isLiked ? "heart" : "heart-outline"}
                        size={16}
                        color={exhibition.isLiked ? "#ff6b6b" : "#999"}
                      />
                      <Text style={SearchStyles.likeCount}>
                        {exhibition.likeCount || 0}
                      </Text>
                    </View>
                    {exhibition.isBookmarked && (
                      <Ionicons
                        name='bookmark'
                        size={16}
                        color='#4ecdc4'
                      />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 전시회 검색 오류 표시 */}
      {exhibitionError && (
        <View style={SearchStyles.errorSection}>
          <Text style={SearchStyles.errorText}>❌ {exhibitionError}</Text>
        </View>
      )}

      {/* 로딩 상태 표시 */}
      {isLoading && (
        <View style={SearchStyles.loadingSection}>
          <Text style={SearchStyles.loadingText}>🔍 검색 중...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}