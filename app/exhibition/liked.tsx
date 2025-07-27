import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";
import TopBar from "@/components/TopBar";
import { useTheme } from "../../contexts/ThemeContext";

// 임시 데이터
const mockLikedExhibitions = [
  {
    id: "1",
    title: "모네 특별전",
    location: "국립중앙박물관",
    date: "2024.01.15 - 2024.03.15",
    image: "https://via.placeholder.com/100x100?text=모네전",
  },
  {
    id: "2",
    title: "반 고흐 생애전",
    location: "서울시립미술관",
    date: "2024.02.01 - 2024.04.30",
    image: "https://via.placeholder.com/100x100?text=반고흐전",
  },
  {
    id: "3",
    title: "현대미술 특별전",
    location: "MMCA",
    date: "2024.01.20 - 2024.05.20",
    image: "https://via.placeholder.com/100x100?text=현대미술전",
  },
];

export default function LikedExhibitionsPage() {
  const { theme } = useTheme();

  const renderExhibitionItem = ({
    item,
  }: {
    item: (typeof mockLikedExhibitions)[0];
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
        <TopBar title='찜한 전시' />
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: theme === "dark" ? "#fff" : "#1c3519" },
            ]}>
            찜한 전시 ({mockLikedExhibitions.length}개)
          </Text>
          {mockLikedExhibitions.length > 0 ? (
            <FlatList
              data={mockLikedExhibitions}
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
                아직 찜한 전시가 없습니다.
              </Text>
              <Text
                style={[
                  styles.emptySubText,
                  { color: theme === "dark" ? "#999" : "#999" },
                ]}>
                관심 있는 전시를 찜해보세요!
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
