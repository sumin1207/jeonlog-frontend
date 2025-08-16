import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useExhibition } from "../../../../contexts/ExhibitionContext";
import { exhibitionData } from "../../../../data/exhibitionsDataStorage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ThumbsUpExhibitionsScreen() {
  const { theme } = useTheme();
  const { thumbsUpExhibitions } = useExhibition();
  const router = useRouter();

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
        {
          backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
          borderColor: theme === "dark" ? "#444" : "#eee",
        },
      ]}
      onPress={() => router.push(`/exhibition/${item.id}`)}
    >
      <Image source={item.image} style={styles.exhibitionImage} />
      <View style={styles.exhibitionInfo}>
        <Text
          style={[
            styles.exhibitionTitle,
            { color: theme === "dark" ? "#ffffff" : "#000000" },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.exhibitionLocation,
            { color: theme === "dark" ? "#cccccc" : "#555555" },
          ]}
        >
          {item.location}
        </Text>
        <Text
          style={[
            styles.exhibitionDate,
            { color: theme === "dark" ? "#cccccc" : "#555555" },
          ]}
        >
          {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#121212" : "#f8f8f8" },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: theme === "dark" ? "#121212" : "#ffffff" },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <Text
          style={[
            styles.headerTitle,
            { color: theme === "dark" ? "white" : "black" },
          ]}
        >
          좋아요한 전시 ({thumbsUpExhibitionsData.length}개)
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {thumbsUpExhibitionsData.length > 0 ? (
        <FlatList
          data={thumbsUpExhibitionsData}
          renderItem={renderExhibitionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              { color: theme === "dark" ? "#cccccc" : "#666666" },
            ]}
          >
            좋아요한 전시가 없습니다.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContentContainer: {
    padding: 20,
  },
  exhibitionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  exhibitionImage: {
    width: 90,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  exhibitionInfo: {
    flex: 1,
    height: 110,
    justifyContent: "space-between",
  },
  exhibitionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  exhibitionLocation: {
    fontSize: 14,
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
