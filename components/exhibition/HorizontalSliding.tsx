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
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

// 임시 전시회 데이터
const originalExhibitions = [
  {
    id: "1",
    title: "일본미술, 네 가지 시선",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "2",
    title: "둠 삭스 전",
    image: require("../../assets/images/exhibitionPoster/exhibition2.png"),
  },
  {
    id: "3",
    title: "반 고흐 생애전",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "4",
    title: "현대미술 특별전",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
  {
    id: "5",
    title: "한국미술 100년",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
  },
];

const HorizontalSliding = () => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const itemWidth = width * 0.8 + 20; // 아이템 너비 + 마진
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => router.push(`/exhibition/${item.id}` as any)}
        style={[
          styles.itemContainer,
          { backgroundColor: theme === "dark" ? "#2a2a2a" : "#e0e0e0" },
        ]}>
        <Image
          source={item.image}
          style={styles.image}
        />
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: theme === "dark" ? "#fff" : "#1c3519" },
            ]}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [theme, router]
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
    height: 250, // 포스터(200) + 제목 영역(50) = 250
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
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
  titleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HorizontalSliding;
