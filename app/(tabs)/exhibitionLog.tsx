import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "../../data/exhibitionsDataStorage";
import ExhibitionLogCard from "@/components/exhibition/ExhibitionLogCard";
import { useFocusEffect, useRouter } from "expo-router";

interface Record {
  exhibitionId: string;
  record: {
    title: string;
    createdAt: string;
  };
  exhibition: {
    id: string;
    title: string;
    image: any;
  };
}

const formatTimestamp = (isoDate: string) => {
  if (!isoDate) {
    return "방금 전";
  }
  const now = new Date();
  const past = new Date(isoDate);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};

export default function ExhibitionLogScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [records, setRecords] = useState<Record[]>([]);
  const [isLatest, setIsLatest] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [isLatest])
  );

  const loadRecords = async () => {
    try {
      const savedRecordsJSON = await AsyncStorage.getItem("exhibition_records");
      const savedRecords = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};

      const visitedIdsJSON = await AsyncStorage.getItem(
        "visited_exhibition_ids"
      );
      const visitedIds = visitedIdsJSON ? JSON.parse(visitedIdsJSON) : [];

      let loadedRecords = visitedIds
        .map((exhibitionId: string) => {
          const exhibition =
            exhibitionData[exhibitionId as keyof typeof exhibitionData];
          if (!exhibition) {
            console.warn(`Exhibition with id ${exhibitionId} not found`);
            return null;
          }
          return {
            exhibitionId,
            record: savedRecords[exhibitionId],
            exhibition: {
              id: exhibition.id,
              title: exhibition.title,
              image: exhibition.image,
            },
          };
        })
        .filter((item: any): item is Record => item !== null && item.record);

      if (isLatest) {
        loadedRecords.sort((a, b) => {
          if (a.record.createdAt && b.record.createdAt) {
            return (
              new Date(b.record.createdAt).getTime() -
              new Date(a.record.createdAt).getTime()
            );
          }
          return 0;
        });
      } else {
        // 인기순 정렬 로직 (추후 구현)
      }

      setRecords(loadedRecords);
      const uniqueIds = new Set(loadedRecords.map(item => item.exhibitionId));
      if (uniqueIds.size !== loadedRecords.length) {
        console.warn("Duplicate exhibitionIds found in records!");
        console.log("All exhibitionIds:", loadedRecords.map(item => item.exhibitionId));
      }
    } catch (error) {
      console.error("Error loading records:", error);
      Alert.alert("오류", "전시 기록을 불러오는 중 문제가 발생했습니다.");
    }
  };

  const { leftColumn, rightColumn } = useMemo(() => {
    const left: Record[] = [];
    const right: Record[] = [];
    records.forEach((record, index) => {
      if (index % 2 === 0) {
        left.push(record);
      } else {
        right.push(record);
      }
    });
    return { leftColumn: left, rightColumn: right };
  }, [records]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffffff",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 20,
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
    },
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    toggleText: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#888",
      marginHorizontal: 5,
    },
    activeToggle: {
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
    },
    scrollView: {
      flex: 1,
    },
    columnContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    column: {
      width: "48%",
      alignItems: "center",
    },
    rightColumn: {
      marginTop: 18,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 18,
      color: theme === "dark" ? "#ccc" : "#666",
    },
  });

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.headerContainer}>
        <Text style={styles.title}> 다른 시선으로 본 전시 기록들</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setIsLatest(true)}>
            <Text style={[styles.toggleText, isLatest && styles.activeToggle]}>
              최신순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLatest(false)}>
            <Text style={[styles.toggleText, !isLatest && styles.activeToggle]}>
              인기순
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {records.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              {leftColumn.map((item) => (
                <TouchableOpacity
                  key={item.exhibitionId}
                  onPress={() => {
                    console.log("Navigating with exhibitionId:", item.exhibitionId);
                    router.push({
                      pathname: `/exhibition-log/${item.exhibitionId}`,
                      params: { exhibitionLogId: item.exhibitionId },
                    });
                  }}
                >
                  <ExhibitionLogCard
                    id={item.exhibition.id}
                    image={item.exhibition.image}
                    logTitle={item.record.title}
                    author={{
                      name: "user",
                      avatar: require("@/assets/images/mainIcon.png"),
                    }}
                    timestamp={formatTimestamp(item.record.createdAt)}
                    likes={0} // Placeholder
                    hashtags={["전시기록"]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.column, styles.rightColumn]}>
              {rightColumn.map((item) => (
                <TouchableOpacity
                  key={item.exhibitionId}
                  onPress={() => {
                    console.log("Navigating with exhibitionId:", item.exhibitionId);
                    router.push({
                      pathname: `/exhibition-log/${item.exhibitionId}`,
                      params: { exhibitionLogId: item.exhibitionId },
                    });
                  }}
                >
                  <ExhibitionLogCard
                    id={item.exhibition.id}
                    image={item.exhibition.image}
                    logTitle={item.record.title}
                    author={{
                      name: "user",
                      avatar: require("@/assets/images/mainIcon.png"),
                    }}
                    timestamp={formatTimestamp(item.record.createdAt)}
                    likes={0} // Placeholder
                    hashtags={["전시기록"]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 기록된 전시가 없습니다.</Text>
        </View>
      )}
    </View>
  );
}
