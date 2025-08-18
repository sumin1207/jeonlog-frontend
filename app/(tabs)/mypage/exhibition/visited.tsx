import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useExhibition } from "../../../../contexts/ExhibitionContext";
import { exhibitionData } from "../../../../data/exhibitionsDataStorage";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WriteRecordButton from "./WriteRecordButton";
import DeleteRecordButton from "././DeleteRecordButton";

export default function VisitedExhibitionsPage() {
  const { theme } = useTheme();
  const { visitedExhibitions } = useExhibition();
  const router = useRouter();
  const [reviews, setReviews] = useState<any>({});

  const loadReviews = async () => {
    try {
      const savedRecordsJSON = await AsyncStorage.getItem("exhibition_records");
      const savedRecords = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};
      setReviews(savedRecords);
    } catch (error) {
      Alert.alert("오류", "리뷰를 불러오는 중 문제가 발생했습니다.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadReviews();
    }, [])
  );

  const visitedExhibitionsData = visitedExhibitions
    .map((id) => {
      const exhibition = exhibitionData[id as keyof typeof exhibitionData];
      if (!exhibition) return null;
      const record = reviews[id];
      return {
        ...exhibition,
        review: record ? record.title : "아직 기록하지 않은 전시",
      };
    })
    .filter(Boolean)
    .reverse();

  const renderExhibitionItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.exhibitionItem,
        {
          backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
          borderColor: theme === "dark" ? "#444" : "#eee",
        },
      ]}
      onPress={() => {
        if (item.id && typeof item.id === "string") {
          console.log("Navigating to exhibition log with ID:", item.id);
          router.push({
            pathname: `/exhibition-log/${item.id}`,
            params: { exhibitionLogId: item.id },
          });
        } else {
          console.log("Invalid exhibition ID for navigation:", item.id);
        }
      }}
    >
      <Image source={item.image} style={styles.exhibitionImage} />
      <View style={styles.exhibitionInfo}>
        <Text
          style={[
            styles.exhibitionTitle,
            { color: theme === "dark" ? "#ffffff" : "#000000" },
          ]}
          numberOfLines={1}
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
            styles.reviewText,
            { color: theme === "dark" ? "#cccccc" : "#666" },
          ]}
        >
          💬 "{item.review}"
        </Text>
      </View>
      <View>
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
            alignSelf: "flex-start",
          }}
          textStyle={{ fontSize: 14 }}
        />
        <DeleteRecordButton
          exhibitionId={item.id}
          onRecordDeleted={loadReviews}
          title="기록 삭제"
          buttonStyle={{
            paddingVertical: 6,
            paddingHorizontal: 6,
            marginTop: 8,
            alignSelf: "flex-start",
          }}
          textStyle={{ fontSize: 14 }}
        />
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
          방문한 전시 ({visitedExhibitionsData.length}개)
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {visitedExhibitionsData.length > 0 ? (
        <FlatList
          data={visitedExhibitionsData}
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
