import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

// 임시 전시회 데이터
const originalExhibitions = [
  {
    id: "1",
    title: "전시회 1",
    imageUrl:
      "https://via.placeholder.com/300x200/FF5733/FFFFFF?text=Exhibition+1",
  },
  {
    id: "2",
    title: "전시회 2",
    imageUrl:
      "https://via.placeholder.com/300x200/33FF57/FFFFFF?text=Exhibition+2",
  },
  {
    id: "3",
    title: "전시회 3",
    imageUrl:
      "https://via.placeholder.com/300x200/3357FF/FFFFFF?text=Exhibition+3",
  },
  {
    id: "4",
    title: "전시회 4",
    imageUrl:
      "https://via.placeholder.com/300x200/F0FF33/FFFFFF?text=Exhibition+4",
  },
  {
    id: "5",
    title: "전시회 5",
    imageUrl:
      "https://via.placeholder.com/300x200/FF33F0/FFFFFF?text=Exhibition+5",
  },
];

const HorizontalSliding = () => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const itemWidth = width * 0.8 + 20; // 아이템 너비 + 마진

  // 무한 스크롤을 위한 데이터 확장
  // 원본 데이터의 앞뒤에 일부를 복사하여 붙임
  const extendedExhibitions = [
    ...originalExhibitions.slice(-2), // 뒤에서 2개 복사
    ...originalExhibitions,
    ...originalExhibitions.slice(0, 2), // 앞에서 2개 복사
  ];

  // 초기 스크롤 위치를 원본 데이터의 시작점으로 설정
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 2, // 원본 데이터의 시작점 (복사된 2개 항목 뒤)
        animated: false,
      });
    }
  }, []);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / itemWidth);

    const originalLength = originalExhibitions.length;
    const extendedLength = extendedExhibitions.length;

    // 끝까지 스크롤했을 때 (복사된 마지막 항목에 도달)
    if (currentIndex >= extendedLength - 2 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 2, // 원본 데이터의 시작점으로 이동
        animated: false,
      });
    }
    // 처음까지 스크롤했을 때 (복사된 첫 항목에 도달)
    else if (currentIndex <= 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: originalLength + 1, // 원본 데이터의 끝점으로 이동
        animated: false,
      });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor: theme === "dark" ? "#2a2a2a" : "#e0e0e0" },
      ]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
      />
      <Text
        style={[
          styles.title,
          { color: theme === "dark" ? "#fff" : "#1c3519" },
        ]}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={extendedExhibitions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate='fast'
        contentContainerStyle={styles.flatListContent}
        onMomentumScrollEnd={handleScroll} // 스크롤이 끝났을 때 이벤트 처리
        getItemLayout={(data, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500, // 캐러셀 전체 높이 조정 (700에서 500으로)
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5, // 상하 여백 줄임 (10에서 5로)
  },
  flatListContent: {
    paddingHorizontal: width * 0.1, // 양쪽 여백
  },
  itemContainer: {
    width: width * 0.8, // 화면 너비의 80%
    marginHorizontal: 10,
    backgroundColor: "#e0e0e0ff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default HorizontalSliding;
