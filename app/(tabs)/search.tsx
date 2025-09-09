import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchExhibitions } from "../../services/searchService";
import { Text } from "../../design-system";
import { SearchStyles } from "../../design-system/styles";

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
  const [exhibitionResults, setExhibitionResults] = useState<any[]>([]);
  const [exhibitionError, setExhibitionError] = useState<string | null>(null);

  // 검색 기록 로드
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // 검색 페이지 포커스 시 초기화
  useFocusEffect(
    useCallback(() => {
      resetSearchPage();
    }, [])
  );

  // 검색 기록 로드 함수
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("search_history");
      if (history) {
        const parsedHistory = JSON.parse(history);
        setSearchHistory(parsedHistory);
      } else {
        setSearchHistory([]);
      }
    } catch (error) {
      console.log("검색 기록 로드 실패:", error);
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

  // 검색 실행 함수 (API 호출 통합)
  const executeSearch = (query: string) => {
    setSearchQuery(query);
    saveSearchHistory(query);
    fetchExhibitionSearchResults(query);
  };

  // 전시회 검색 API 호출 함수
  const fetchExhibitionSearchResults = async (query: string) => {
    setExhibitionError(null);
    setExhibitionResults([]);
    setIsLoading(true);

    try {
      // 로그인 상태 확인
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) {
        setExhibitionError("검색을 위해서는 로그인이 필요합니다.");
        setIsLoading(false);
        return;
      }

      const res = await searchExhibitions(query, {
        filter: "title,artist",
        location: "서울",
      });

      console.log("🔍 API 응답 타입:", typeof res);
      console.log("🔍 API 응답이 배열인가?", Array.isArray(res));
      console.log("🔍 API 응답 데이터:", res);

      // API 응답 처리
      let results = [];

      if (Array.isArray(res)) {
        // 배열로 직접 반환되는 경우
        results = res;
      } else if (res && Array.isArray(res.data)) {
        // {data: [...]} 형태인 경우
        results = res.data;
      } else if (res && res.success && Array.isArray(res.data)) {
        // {success: true, data: [...]} 형태인 경우
        results = res.data;
      } else if (res && res.result && Array.isArray(res.result)) {
        // {result: [...]} 형태인 경우
        results = res.result;
      } else {
        console.log("❌ 예상치 못한 API 응답 구조:", res);
        setExhibitionError("검색 결과를 가져올 수 없습니다.");
        return;
      }

      console.log("✅ 처리된 검색 결과:", results);
      setExhibitionResults(results);
    } catch (err: any) {
      if (err.message && err.message.includes("401")) {
        setExhibitionError("인증이 필요합니다. 다시 로그인해주세요.");
      } else if (err.response) {
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
    setExhibitionResults([]);
    setExhibitionError(null);
    setIsLoading(false);
    setIsSearchFocused(false);
    setShowHistory(false);
    setSelectedMuseum(null);
  };

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

      {/* 검색 입력창 포커스 시 - 검색 기록만 표시 (검색 결과가 있을 때는 숨김) */}
      {showHistory && exhibitionResults.length === 0 && (
        <View style={SearchStyles.popularSection}>
          {searchHistory.length > 0 ? (
            <>
              <View style={SearchStyles.historyHeader}>
                <Text style={SearchStyles.popularTitle}>최근 검색어</Text>
                <TouchableOpacity onPress={clearAllSearchHistory}>
                  <Text style={SearchStyles.clearHistoryText}>전체 삭제</Text>
                </TouchableOpacity>
              </View>
              <View style={SearchStyles.popularDivider} />
              {searchHistory.map((term, index) => (
                <TouchableOpacity
                  key={index}
                  style={SearchStyles.historyItem}
                  onPress={() => {
                    setSearchQuery(term);
                    executeSearch(term);
                  }}>
                  <Ionicons
                    name='time-outline'
                    size={16}
                    color='#999'
                  />
                  <Text style={SearchStyles.historyText}>{term}</Text>
                  <TouchableOpacity
                    onPress={() => deleteSearchHistory(term)}
                    style={SearchStyles.deleteButton}>
                    <Ionicons
                      name='close'
                      size={16}
                      color='#999'
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={SearchStyles.emptyHistorySection}>
              <Text style={SearchStyles.emptyHistoryText}>
                최근 검색어가 없습니다
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 검색 입력창 포커스 해제 시 - 인기 검색어 또는 검색 결과 표시 */}
      {!showHistory && (
        <>
          {/* 검색어가 없을 때 - 인기 검색어 표시 */}
          {!searchQuery && (
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
                      <Text style={SearchStyles.popularNumber}>
                        {index + 1}.
                      </Text>
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
                      <Text style={SearchStyles.popularNumber}>
                        {index + 6}.
                      </Text>
                      <Text style={SearchStyles.popularText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </>
      )}

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
                router.push(`/exhibition/${exhibition.id}`);
              }}>
              <View style={SearchStyles.exhibitionCard}>
                <View style={SearchStyles.exhibitionInfo}>
                  <Text style={SearchStyles.resultTitle}>
                    {exhibition.title}
                  </Text>
                  {exhibition.artist && (
                    <Text style={SearchStyles.resultArtist}>
                      👨‍🎨 {exhibition.artist}
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
                        📅 {exhibition.startDate} ~ {exhibition.endDate}
                      </Text>
                    )}
                    {exhibition.price && (
                      <Text style={SearchStyles.resultPrice}>
                        💰 {exhibition.price.toLocaleString()}원
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 검색 결과가 없을 때 */}
      {searchQuery &&
        !isLoading &&
        exhibitionResults.length === 0 &&
        !exhibitionError && (
          <View style={SearchStyles.emptySection}>
            <Ionicons
              name='search-outline'
              size={48}
              color='#ccc'
            />
            <Text style={SearchStyles.emptyTitle}>검색 결과가 없습니다</Text>
            <Text style={SearchStyles.emptyDescription}>
              다른 검색어로 시도해보세요
            </Text>
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
