import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CategoryDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { type, category } = useLocalSearchParams();

  // Data (remains unchanged)
  const regionData = {
    "강남, 서초, 양재": [
      {
        id: "1",
        title: "강남 현대미술전",
        location: "강남갤러리",
        date: "2025.01.01~03.31",
      },
      {
        id: "2",
        title: "서초 전통예술전",
        location: "서초문화관",
        date: "2025.02.01~04.30",
      },
      {
        id: "3",
        title: "양재 디자인전",
        location: "양재디자인센터",
        date: "2025.03.01~05.31",
      },
    ],
    "잠실, 송파, 강동": [
      {
        id: "4",
        title: "잠실 스포츠아트전",
        location: "잠실올림픽공원",
        date: "2025.04.01~06.30",
      },
      {
        id: "5",
        title: "송파 현대조각전",
        location: "송파아트센터",
        date: "2025.05.01~07.31",
      },
      {
        id: "6",
        title: "강동 사진전",
        location: "강동문화관",
        date: "2025.06.01~08.31",
      },
    ],
    "동작, 관악, 사당": [
      {
        id: "7",
        title: "동작 민속전",
        location: "동작문화관",
        date: "2025.07.01~09.30",
      },
      {
        id: "8",
        title: "관악 대학생전",
        location: "관악아트센터",
        date: "2025.08.01~10.31",
      },
      {
        id: "9",
        title: "사당 현대회화전",
        location: "사당갤러리",
        date: "2025.09.01~11.30",
      },
    ],
    "마포, 서대문, 은평": [
      {
        id: "10",
        title: "마포 독립영화전",
        location: "마포문화관",
        date: "2025.10.01~12.31",
      },
      {
        id: "11",
        title: "서대문 역사전",
        location: "서대문자연사박물관",
        date: "2025.11.01~2026.01.31",
      },
      {
        id: "12",
        title: "은평 공예전",
        location: "은평문화관",
        date: "2025.12.01~2026.02.28",
      },
    ],
    "강북, 노원, 도봉": [
      {
        id: "13",
        title: "강북 전통공예전",
        location: "강북문화관",
        date: "2026.01.01~03.31",
      },
      {
        id: "14",
        title: "노원 과학예술전",
        location: "노원과학관",
        date: "2026.02.01~04.30",
      },
      {
        id: "15",
        title: "도봉 자연예술전",
        location: "도봉문화관",
        date: "2026.03.01~05.31",
      },
    ],
    "성북, 중랑, 광진": [
      {
        id: "16",
        title: "성북 문학예술전",
        location: "성북문화관",
        date: "2026.04.01~06.30",
      },
      {
        id: "17",
        title: "중랑 현대미술전",
        location: "중랑아트센터",
        date: "2026.05.01~07.31",
      },
      {
        id: "18",
        title: "광진 패션아트전",
        location: "광진문화관",
        date: "2026.06.01~08.31",
      },
    ],
    "용산, 중구, 종로": [
      {
        id: "19",
        title: "용산 군사예술전",
        location: "용산전쟁기념관",
        date: "2026.07.01~09.30",
      },
      {
        id: "20",
        title: "중구 도시예술전",
        location: "중구문화관",
        date: "2026.08.01~10.31",
      },
      {
        id: "21",
        title: "종로 전통문화전",
        location: "종로문화관",
        date: "2026.09.01~11.30",
      },
    ],
    "영등포, 강서, 양천": [
      {
        id: "22",
        title: "영등포 비즈니스아트전",
        location: "영등포문화관",
        date: "2026.10.01~12.31",
      },
      {
        id: "23",
        title: "강서 항공예술전",
        location: "강서문화관",
        date: "2026.11.01~2027.01.31",
      },
      {
        id: "24",
        title: "양천 가족예술전",
        location: "양천문화관",
        date: "2026.12.01~2027.02.28",
      },
    ],
  };

  const personalityData = {
    차분한: [
      {
        id: "25",
        title: "차분한 명상예술전",
        location: "명상갤러리",
        date: "2025.01.01~03.31",
      },
      {
        id: "26",
        title: "평화로운 자연예술전",
        location: "자연문화관",
        date: "2025.02.01~04.30",
      },
      {
        id: "27",
        title: "고요한 서예전",
        location: "서예관",
        date: "2025.03.01~05.31",
      },
    ],
    역동적인: [
      {
        id: "28",
        title: "역동적인 스포츠아트전",
        location: "스포츠갤러리",
        date: "2025.04.01~06.30",
      },
      {
        id: "29",
        title: "활발한 댄스아트전",
        location: "댄스문화관",
        date: "2025.05.01~07.31",
      },
      {
        id: "30",
        title: "에너지 넘치는 현대예술전",
        location: "에너지갤러리",
        date: "2025.06.01~08.31",
      },
    ],
    로맨틱한: [
      {
        id: "31",
        title: "로맨틱한 사랑예술전",
        location: "사랑갤러리",
        date: "2025.07.01~09.30",
      },
      {
        id: "32",
        title: "감성적인 시예술전",
        location: "시문화관",
        date: "2025.08.01~10.31",
      },
      {
        id: "33",
        title: "따뜻한 가족예술전",
        location: "가족갤러리",
        date: "2025.09.01~11.30",
      },
    ],
    고전적인: [
      {
        id: "34",
        title: "고전적인 문학예술전",
        location: "문학갤러리",
        date: "2025.10.01~12.31",
      },
      {
        id: "35",
        title: "전통적인 민속예술전",
        location: "민속문화관",
        date: "2025.11.01~2026.01.31",
      },
      {
        id: "36",
        title: "우아한 고전음악전",
        location: "음악갤러리",
        date: "2025.12.01~2026.02.28",
      },
    ],
  };

  const getExhibitionData = () => {
    if (type === "region") {
      return regionData[category as keyof typeof regionData] || [];
    } else if (type === "personality") {
      return personalityData[category as keyof typeof personalityData] || [];
    }
    return [];
  };

  const exhibitionData = getExhibitionData();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#000000" : "#FFFFFF",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    backButton: {
      padding: 8,
      marginLeft: -8,
    },
    headerTitleContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    categoryType: {
      fontSize: 12,
      fontWeight: "500",
      color: theme === "dark" ? "#888" : "#666",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginTop: 2,
    },
    listContainer: {
      paddingHorizontal: 20,
    },
    exhibitionItem: {
      flexDirection: "row",
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
      alignItems: "center",
    },
    exhibitionImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: theme === "dark" ? "#2c2c2c" : "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    exhibitionInfo: {
      flex: 1,
      justifyContent: "center",
    },
    exhibitionTitle: {
      fontSize: 17,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 8,
    },
    exhibitionLocation: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#555",
      marginBottom: 4,
    },
    exhibitionDate: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#555",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme === "dark" ? "#999" : "#666",
      textAlign: "center",
      lineHeight: 24,
    },
  });

  const renderExhibitionItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.exhibitionItem}
      onPress={() => router.push(`/exhibition/${item.id}` as any)}
      activeOpacity={0.7}>
      <View style={styles.exhibitionImage}>
        <Ionicons
          name='image-outline'
          size={32}
          color={theme === "dark" ? "#555" : "#ccc"}
        />
      </View>
      <View style={styles.exhibitionInfo}>
        <Text
          style={styles.exhibitionTitle}
          numberOfLines={1}>
          {item.title}
        </Text>
        <Text
          style={styles.exhibitionLocation}
          numberOfLines={1}>
          {item.location}
        </Text>
        <Text
          style={styles.exhibitionDate}
          numberOfLines={1}>
          {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons
            name='arrow-back-outline'
            size={28}
            color={theme === "dark" ? "#fff" : "#1c3519"}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.categoryType}>
            {type === "region" ? "지역별" : "성격별"}
          </Text>
          <Text
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {category}
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {exhibitionData.length > 0 ? (
        <FlatList
          data={exhibitionData}
          renderItem={renderExhibitionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name='sad-outline'
            size={60}
            color={theme === "dark" ? "#555" : "#ccc"}
          />
          <Text style={styles.emptyText}>해당 카테고리의 전시가 없습니다.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
