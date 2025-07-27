import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";
import TopBar from "@/components/TopBar";
import { useTheme } from "../../contexts/ThemeContext";

// 임시 데이터
const mockThumbsUpExhibitions = [
  {
    id: "1",
    title: "피카소 특별전",
    location: "국립현대미술관",
    date: "2024.02.10 - 2024.05.10",
    likes: 1250,
    image: "https://via.placeholder.com/100x100?text=피카소전",
  },
  {
    id: "2",
    title: "르네상스 미술전",
    location: "국립중앙박물관",
    date: "2024.01.25 - 2024.04.25",
    likes: 890,
    image: "https://via.placeholder.com/100x100?text=르네상스전",
  },
  {
    id: "3",
    title: "한국 현대미술전",
    location: "서울시립미술관",
    date: "2024.03.01 - 2024.06.01",
    likes: 567,
    image: "https://via.placeholder.com/100x100?text=한국현대전",
  },
];

export default function ThumbsUpExhibitionsPage() {
  const { theme } = useTheme();

  const renderExhibitionItem = ({
    item,
  }: {
    item: (typeof mockThumbsUpExhibitions)[0];
  }) => (
    <View
      style={[
        styles.exhibitionItem,
        { backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff" },
      ]}>
      <View style={styles.exhibitionImage}>
        <Text style={styles.imagePlaceholder}>🖼️</Text>
      </View>
      <View style={styles.exhibitionInfo}>
        <Text
          style={[
            styles.exhibitionTitle,
            { color: theme === "dark" ? "#fff" : "#1c3519" },
          ]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.exhibitionLocation,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}>
          📍 {item.location}
        </Text>
        <Text
          style={[
            styles.exhibitionDate,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}>
          📅 {item.date}
        </Text>
        <View style={styles.likesContainer}>
          <Text
            style={[
              styles.likesText,
              { color: theme === "dark" ? "#ff6b6b" : "#ff6b6b" },
            ]}>
            👍 {item.likes.toLocaleString()}명이 좋아합니다
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5" },
        ]}>
        <TopBar title='좋아요 전시' />
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: theme === "dark" ? "#fff" : "#1c3519" },
            ]}>
            좋아요 전시 ({mockThumbsUpExhibitions.length}개)
          </Text>
          {mockThumbsUpExhibitions.length > 0 ? (
            <FlatList
              data={mockThumbsUpExhibitions}
              renderItem={renderExhibitionItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme === "dark" ? "#ccc" : "#666" },
                ]}>
                아직 좋아요한 전시가 없습니다.
              </Text>
              <Text
                style={[
                  styles.emptySubText,
                  { color: theme === "dark" ? "#999" : "#999" },
                ]}>
                마음에 드는 전시에 좋아요를 눌러보세요!
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  exhibitionItem: {
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
  exhibitionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  imagePlaceholder: {
    fontSize: 32,
  },
  exhibitionInfo: {
    flex: 1,
    justifyContent: "center",
  },
  exhibitionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  exhibitionLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  exhibitionDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  likesContainer: {
    marginTop: 4,
  },
  likesText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
  },
});
