import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";
import ExhibitionLogCard from "./ExhibitionLogCard";
import { useRouter } from "expo-router";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, Container } from "../../../design-system";
import { ExhibitionLogStyles } from "../../../design-system/styles";

interface Record {
  id: string;
  title: string;
  createdAt: string;
  hashtags?: string[];
  mainImage?: string;
}

const formatTimestamp = (isoDate: string) => {
  if (!isoDate) return "방금 전";
  const now = new Date();
  const past = new Date(isoDate);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};

export default function ExhibitionLogScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { myLogs, isLoading } = useExhibition();
  const [isLatest, setIsLatest] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const sortedRecords = useMemo(() => {
    let records = [...myLogs];

    if (searchQuery.trim() !== "") {
      records = records.filter((log) => {
        const exhibition =
          exhibitionData[log.id as keyof typeof exhibitionData];
        const logTitleMatch = log.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const exhibitionTitleMatch = exhibition?.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const hashtagsMatch = log.hashtags?.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return logTitleMatch || exhibitionTitleMatch || hashtagsMatch;
      });
    }

    if (isLatest) {
      records.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      // TODO: 인기순 정렬
    }
    return records;
  }, [myLogs, isLatest, searchQuery]);

  if (isLoading) {
    return (
      <View
        style={[
          ExhibitionLogStyles.container,
          ExhibitionLogStyles.emptyContainer,
        ]}>
        <ActivityIndicator
          size='large'
          color='#1c3519'
        />
      </View>
    );
  }

  const renderItem = ({ item: log, index }: { item: Record; index: number }) => {
    const exhibition = exhibitionData[log.id as keyof typeof exhibitionData];
    const isRightColumn = index % 2 !== 0;
    return (
      <View
        style={{
          flex: 1,
          margin: 4,
          maxWidth: "48%",
          marginTop: isRightColumn ? 22 : 4, // Apply marginTop to the right column
        }}>
        <TouchableOpacity
          key={log.id}
          onPress={() => router.push(`/exhibition-log/${log.id}`)}>
          <ExhibitionLogCard
            id={log.id}
            image={log.mainImage ? { uri: log.mainImage } : exhibition.image}
            logTitle={log.title}
            author={{
              name: "user", //추후 유저 데이터로 대체
              avatar: require("@/assets/images/mainIcon.png"),
            }}
            timestamp={formatTimestamp(log.createdAt)}
            hashtags={log.hashtags || ["전시기록"]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container
      variant="safe"
      style={ExhibitionLogStyles.container}>
      <View style={ExhibitionLogStyles.searchHeader}>
        <View style={ExhibitionLogStyles.searchContainer}>
          <Ionicons
            name='search'
            size={20}
            color='#888'
            style={ExhibitionLogStyles.searchIcon}
          />
          <TextInput
            style={ExhibitionLogStyles.searchInput}
            placeholder='기록, 전시, 해시태그 검색'
            placeholderTextColor='#888'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={ExhibitionLogStyles.clearButton}>
              <Ionicons
                name='close-circle'
                size={20}
                color='#888'
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={ExhibitionLogStyles.headerContainer}>
        <Text style={ExhibitionLogStyles.title}>
          {" "}
          다른 시선으로 본 전시 기록들
        </Text>
        <View style={ExhibitionLogStyles.toggleContainer}>
          <TouchableOpacity onPress={() => setIsLatest(true)}>
            <Text
              style={
                isLatest
                  ? {
                      ...ExhibitionLogStyles.toggleText,
                      ...ExhibitionLogStyles.activeToggle,
                    }
                  : ExhibitionLogStyles.toggleText
              }>
              최신순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLatest(false)}>
            <Text
              style={
                !isLatest
                  ? {
                      ...ExhibitionLogStyles.toggleText,
                      ...ExhibitionLogStyles.activeToggle,
                    }
                  : ExhibitionLogStyles.toggleText
              }>
              인기순
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {sortedRecords.length > 0 ? (
        <FlatList
          data={sortedRecords}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      ) : (
        <View style={ExhibitionLogStyles.emptyContainer}>
          <Text style={ExhibitionLogStyles.emptyText}>
            {searchQuery
              ? "검색 결과가 없습니다."
              : "아직 기록된 전시가 없습니다."}
          </Text>
        </View>
      )}
    </Container>
  );
}
