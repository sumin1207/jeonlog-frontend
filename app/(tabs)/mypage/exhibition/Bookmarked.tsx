import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useExhibition } from "../../../../contexts/ExhibitionContext";
import { exhibitionData } from "../../../../data/exhibitionsDataStorage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Container } from "../../../../design-system";
import { BookmarkedStyles } from "../../../../design-system/styles";
import { Colors } from "../../../../design-system/theme";
import { BookmarkButton } from "../../../../components/ui";

export default function BookmarkedExhibitionsScreen() {
  const { theme } = useTheme();
  const { BookmarkedExhibitions, loadBookmarksFromAPI } = useExhibition();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setIsLoading(true);
        await loadBookmarksFromAPI();
      } catch (error) {
        console.error("북마크 목록 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const bookmarkedExhibitionsData = BookmarkedExhibitions.map(
    (id) => exhibitionData[id as keyof typeof exhibitionData]
  ).filter(Boolean);

  const renderExhibitionItem = ({
    item,
  }: {
    item: (typeof exhibitionData)[keyof typeof exhibitionData];
  }) => (
    <View style={BookmarkedStyles.exhibitionItem}>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: "row" }}
        onPress={() => router.push(`/exhibition/${item.id}`)}>
        <Image
          source={item.image}
          style={BookmarkedStyles.exhibitionImage}
        />
        <View style={BookmarkedStyles.exhibitionInfo}>
          <Text
            style={BookmarkedStyles.exhibitionTitle}
            numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={BookmarkedStyles.exhibitionLocation}>
            {item.location}
          </Text>
          <Text style={BookmarkedStyles.exhibitionDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
      <BookmarkButton
        exhibitionId={item.id}
        size={20}
        color={theme === "dark" ? "#ccc" : "#666"}
        activeColor='#FF6B6B'
        style={{ marginLeft: 8 }}
      />
    </View>
  );

  if (isLoading) {
    return (
      <Container style={BookmarkedStyles.container}>
        <View style={BookmarkedStyles.header}>
          <Pressable
            onPress={() => router.back()}
            style={BookmarkedStyles.backButton}>
            <Ionicons
              name='arrow-back'
              size={24}
              color={Colors.text.primary}
            />
          </Pressable>
          <Text style={BookmarkedStyles.headerTitle}>찜한 전시</Text>
          <View style={{ width: 24 }} />
        </View>
        <View
          style={[
            BookmarkedStyles.emptyContainer,
            { flex: 1, justifyContent: "center" },
          ]}>
          <ActivityIndicator
            size='large'
            color={Colors.primary.main}
          />
          <Text
            style={StyleSheet.flatten([
              BookmarkedStyles.emptyText,
              { marginTop: 16 },
            ])}>
            북마크 목록을 불러오는 중...
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container style={BookmarkedStyles.container}>
      <View style={BookmarkedStyles.header}>
        <Pressable
          onPress={() => router.back()}
          style={BookmarkedStyles.backButton}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={Colors.text.primary}
          />
        </Pressable>
        <Text style={BookmarkedStyles.headerTitle}>
          찜한 전시 ({bookmarkedExhibitionsData.length}개)
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {bookmarkedExhibitionsData.length > 0 ? (
        <FlatList
          data={bookmarkedExhibitionsData}
          renderItem={renderExhibitionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={BookmarkedStyles.listContentContainer}
        />
      ) : (
        <View style={BookmarkedStyles.emptyContainer}>
          <Text style={BookmarkedStyles.emptyText}>찜한 전시가 없습니다.</Text>
        </View>
      )}
    </Container>
  );
}
