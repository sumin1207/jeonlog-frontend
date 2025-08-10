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
import { exhibitionData } from "../../../../data/exhibitionsDataStorage";
import { useRouter } from "expo-router";

export default function BookmarkedExhibitionsScreen() {
  const { theme } = useTheme();
  const { BookmarkedExhibitions } = useExhibition();
  const router = useRouter();

  // 찜한 전시회만 필터링
  const BookmarkedExhibitionsData = BookmarkedExhibitions.map(
    (id) => exhibitionData[id as keyof typeof exhibitionData]
  ).filter(Boolean);

  const renderExhibitionItem = ({
    item,
  }: {
    item: (typeof exhibitionData)[keyof typeof exhibitionData];
  }) => (
    <TouchableOpacity
      style={[
        styles.exhibitionItem,
        { backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff" },
      ]}
      onPress={() => router.push(`/exhibition/${item.id}`)}
    >
      <Image source={item.image} style={styles.exhibitionImage} />
      <View style={styles.exhibitionInfo}>
        <Text
          style={[
            styles.exhibitionTitle,
            { color: theme === "dark" ? "#fff" : "#1c3519" },
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.exhibitionLocation,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}
        >
          📍 {item.location}
        </Text>
        <Text
          style={[
            styles.exhibitionDate,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}
        >
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
      ]}
    >
      <TopBar title="찜한 전시" />
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: theme === "dark" ? "#fff" : "#1c3519" },
          ]}
        >
          찜한 전시 ({BookmarkedExhibitionsData.length}개)
        </Text>
        {BookmarkedExhibitionsData.length > 0 ? (
          <FlatList
            data={BookmarkedExhibitionsData}
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
              ]}
            >
              찜한 전시가 없습니다.
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
