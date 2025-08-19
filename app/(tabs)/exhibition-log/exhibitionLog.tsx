import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../../contexts/ThemeContext";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";
import ExhibitionLogCard from "./ExhibitionLogCard";
import { useRouter } from "expo-router";
import { useExhibition } from "../../../contexts/ExhibitionContext";

interface Record {
  id: string;
  title: string;
  createdAt: string;
  hashtags?: string[];
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

  // asyncStorage에서 쓰레기 데이터 불러오는거 방지
  const validLogs = useMemo(
    () =>
      myLogs.filter(
        (log) => exhibitionData[log.id as keyof typeof exhibitionData]
      ),
    [myLogs]
  );

  const sortedRecords = useMemo(() => {
    const records = [...validLogs];
    if (isLatest) {
      records.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      // TODO: 인기순 정렬
    }
    return records;
  }, [validLogs, isLatest]);

  // 좌우 구분 두줄로 출력
  const { leftColumn, rightColumn } = useMemo(() => {
    const left: Record[] = [];
    const right: Record[] = [];
    sortedRecords.forEach((record, index) => {
      if (index % 2 === 0) {
        left.push(record);
      } else {
        right.push(record);
      }
    });
    return { leftColumn: left, rightColumn: right };
  }, [sortedRecords]);

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <ActivityIndicator
          size='large'
          color='#1c3519'
        />
      </View>
    );
  }

  const renderColumn = (columnData: Record[]) => {
    return columnData.map((log) => {
      const exhibition = exhibitionData[log.id as keyof typeof exhibitionData];
      return (
        <TouchableOpacity
          key={log.id}
          onPress={() => router.push(`/exhibition-log/${log.id}`)}>
          <ExhibitionLogCard
            id={log.id}
            image={exhibition.image}
            logTitle={log.title}
            author={{
              name: "user", //추후 유저 데이터로 대체
              avatar: require("@/assets/images/mainIcon.png"),
            }}
            timestamp={formatTimestamp(log.createdAt)}
            likes={0}
            hashtags={log.hashtags || ["전시기록"]}
          />
        </TouchableOpacity>
      );
    });
  };

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
      {sortedRecords.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>{renderColumn(leftColumn)}</View>
            <View style={[styles.column, styles.rightColumn]}>
              {renderColumn(rightColumn)}
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

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffffff",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 20,
      paddingHorizontal: 20,
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
      paddingHorizontal: 20,
    },
    columnContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    column: {
      width: "48%",
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
