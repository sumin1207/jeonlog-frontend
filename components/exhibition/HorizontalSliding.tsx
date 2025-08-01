//요즘 뜨고 있는 전시
//좌우 슬라이딩 구현
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

// 임시 전시회 데이터
const originalExhibitions = [
  {
    id: "1",
    title: "전시회 1",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
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

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View
        style={[
          styles.itemContainer,
          { backgroundColor: theme === "dark" ? "#2a2a2a" : "#e0e0e0" },
        ]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
        />
        {/* <Text
        style={[styles.title, { color: theme === "dark" ? "#fff" : "#1c3519" }]}
      >
        {item.title}
      </Text> */}
        <View style={styles.titleContainter}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
    ),
    [theme]
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={originalExhibitions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        //pagingEnabled =>아이템 단위로 제어할려고 일단 비활성화함
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment='center' //스크롤 멈출때 가운데 정렬
        decelerationRate='normal' //넘기는 속도 fast=>normal로 수정함
        contentContainerStyle={styles.flatListContent}
        // onMomentumScrollEnd={handleScroll} // Removed
        getItemLayout={(data, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        initialNumToRender={3}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200, // 캐러셀 전체 높이 조정 (700에서 500에서 200으로)
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5, // 상하 여백 줄임 (10에서 5로)
  },
  flatListContent: {
    //paddingHorizontal: width * 0.1, // 양쪽 여백
    paddingHorizontal: (width - width * 0.8) / 2 - 10, //디바이스마다 화면 크기가 달라 아이템이 중앙에 오도록 동적 여백 계산
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
    textAlign: "center",
    color: "black",
  },
  titleContainter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HorizontalSliding;
