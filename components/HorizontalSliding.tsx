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
  const [currentIndex, setCurrentIndex] = useState(2); //현재 슬라이드 인덱스값, 초기값 슬라이드 2개 설정
  const timerRef = useRef<number | null>(null);
  // 무한 스크롤을 위한 데이터 확장
  // 원본 데이터의 앞뒤에 일부를 복사하여 붙임
  const extendedExhibitions = [
    ...originalExhibitions.slice(-2), // 뒤에서 3개 복사
    ...originalExhibitions,
    ...originalExhibitions.slice(0, 2), // 앞에서 3개 복사
  ];
  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000);
  };
  // 초기 스크롤 위치를 원본 데이터의 시작점으로 설정
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 2, // 원본 데이터의 시작점 (복사된 2개 항목 뒤)
        animated: false,
      });
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    //const currentIndex = Math.round(contentOffsetX / itemWidth);
    const newIndex = Math.round(contentOffsetX / itemWidth);
    setCurrentIndex(newIndex);
    const originalLength = originalExhibitions.length;
    const extendedLength = extendedExhibitions.length;

    // 끝까지 스크롤했을 때 (복사된 마지막 항목에 도달)
    //if (currentIndex >= extendedLength - 2 && flatListRef.current) {
    if (newIndex >= extendedLength - 2) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: 2, // 원본 데이터의 시작점으로 이동
            animated: false,
          });
          setCurrentIndex(2);
        }
      }, 150);
    }
    // 처음까지 스크롤했을 때 (복사된 첫 항목에 도달)
    // else if (currentIndex <= 1 && flatListRef.current) {
    //   flatListRef.current.scrollToIndex({
    else if (newIndex <= 1) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: originalLength + 1, // 원본 데이터의 끝점으로 이동
            animated: false,
          });
          setCurrentIndex(originalLength + 1);
        }
      });
    }
    startTimer();
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View
        style={[
          styles.itemContainer,
          { backgroundColor: theme === "dark" ? "#2a2a2a" : "#e0e0e0" },
        ]}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
        data={extendedExhibitions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        //pagingEnabled =>아이템 단위로 제어할려고 일단 비활성화함
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="center" //스크롤 멈출때 가운데 정렬
        decelerationRate="normal" //넘기는 속도 fast=>normal로 수정함
        contentContainerStyle={styles.flatListContent}
        onMomentumScrollEnd={handleScroll} // 스크롤이 끝났을 때 이벤트 처리
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
    //paddingHorizontal: width * 0.1, // 양쪽 여백                                                                      │
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
