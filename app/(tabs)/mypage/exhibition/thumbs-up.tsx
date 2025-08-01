import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useExhibition } from "../../../../contexts/ExhibitionContext";
import TopBar from "../../../../components/ui/TopBar";

// 전시 데이터 (나중에 API로 대체)
const exhibitionData = {
  "1": {
    id: "1",
    title: "일본미술, 네 가지 시선",
    location: "국립중앙박물관 상설전시관 3층 306호",
    date: "2025.06.17 - 2025.08.10",
    image: require("../../../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  "2": {
    id: "2",
    title: "모네 특별전",
    location: "서울시립미술관",
    date: "2024.02.01 - 2024.04.30",
    image: require("../../../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  "3": {
    id: "3",
    title: "반 고흐 생애전",
    location: "서울시립미술관",
    date: "2024.03.01 - 2024.05.15",
    image: require("../../../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  "4": {
    id: "4",
    title: "현대미술 특별전",
    location: "MMCA",
    date: "2024.01.20 - 2024.05.20",
    image: require("../../../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  "5": {
    id: "5",
    title: "한국미술 100년",
    location: "국립중앙박물관",
    date: "2024.04.01 - 2024.06.30",
    image: require("../../../../assets/images/exhibitionPoster/exhibition1.png"),
  },
};

export default function ThumbsUpExhibitionsScreen() {
  const { theme } = useTheme();
  const { thumbsUpExhibitions } = useExhibition();

  // 좋아요한 전시회만 필터링
  const thumbsUpExhibitionsData = thumbsUpExhibitions
    .map((id) => exhibitionData[id as keyof typeof exhibitionData])
    .filter(Boolean);

  const renderExhibitionItem = ({
    item,
  }: {
    item: (typeof exhibitionData)[keyof typeof exhibitionData];
  }) => (
    <TouchableOpacity
      style={[
        styles.exhibitionItem,
        { backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff" },
      ]}>
      <Image
        source={item.image}
        style={styles.exhibitionImage}
      />
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
    </TouchableOpacity>
  );

  return (
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
          좋아요 전시 ({thumbsUpExhibitionsData.length}개)
        </Text>
        {thumbsUpExhibitionsData.length > 0 ? (
          <FlatList
            data={thumbsUpExhibitionsData}
            renderItem={renderExhibitionItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: theme === "dark" ? "#ccc" : "#666" },
              ]}>
              좋아요한 전시가 없습니다.
            </Text>
          </View>
        )}
      </View>
    </View>
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
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
    marginRight: 16,
  },
  exhibitionInfo: {
    flex: 1,
    justifyContent: "center",
  },
  exhibitionTitle: {
    fontSize: 16,
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
    fontSize: 16,
    textAlign: "center",
  },
});
