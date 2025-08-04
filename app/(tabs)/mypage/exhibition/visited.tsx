import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import TopBar from "../../../../components/ui/TopBar";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "../../../../data/exhibitionsDataStorage";
import WriteRecordButton from "./WriteRecordButton";

export default function VisitedExhibitionsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [visitedExhibitions, setVisitedExhibitions] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadVisitedExhibitions = async () => {
        try {
          const visitedIdsJSON = await AsyncStorage.getItem(
            "visited_exhibition_ids"
          );
          const visitedIds = visitedIdsJSON ? JSON.parse(visitedIdsJSON) : [];

          const savedRecordsJSON = await AsyncStorage.getItem(
            "exhibition_records"
          );
          const savedRecords = savedRecordsJSON
            ? JSON.parse(savedRecordsJSON)
            : {};

          const exhibitions = visitedIds
            .map((id: string) => {
              const exhibition = exhibitionData[id as keyof typeof exhibitionData];
              if (!exhibition) return null;

              const record = savedRecords[id];
              return {
                ...exhibition,
                review: record ? record.title : "아직 기록하지 않은 전시",
              };
            })
            .filter(Boolean);

          setVisitedExhibitions(exhibitions.reverse()); // Show most recent first
        } catch (error) {
          Alert.alert("오류", "방문 기록을 불러오는 중 문제가 발생했습니다.");
        }
      };

      loadVisitedExhibitions();
    }, [])
  );

  const renderExhibitionItem = ({ item }: { item: any }) => (
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
            styles.reviewText,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}
        >
          💬 "{item.review}"
        </Text>
      </View>
      <WriteRecordButton
        title="기록 수정"
        onPress={() =>
          router.push({
            pathname: "/exhibition/write-record",
            params: { exhibitionId: item.id },
          })
        }
        buttonStyle={{
          paddingVertical: 6,
          paddingHorizontal: 6,
          marginTop: 8,
          alignSelf: "flex-start",
        }}
        textStyle={{ fontSize: 14 }}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5" },
      ]}
    >
      <TopBar title="방문한 전시" />
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: theme === "dark" ? "#fff" : "#1c3519" },
          ]}
        >
          방문한 전시 ({visitedExhibitions.length}개)
        </Text>
        {visitedExhibitions.length > 0 ? (
          <FlatList
            data={visitedExhibitions}
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
              ]}
            >
              아직 방문한 전시가 없습니다.
            </Text>
            <Text
              style={[
                styles.emptySubText,
                { color: theme === "dark" ? "#999" : "#999" },
              ]}
            >
              전시를 관람하고 방문 기록을 남겨보세요!
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
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  exhibitionLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50, 
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