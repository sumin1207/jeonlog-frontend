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
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "expo-router";
import { exhibitionData } from "../../data/exhibitionsDataStorage"; 

const { width } = Dimensions.get("window");
const exhibitionsArray = Object.values(exhibitionData);

const RecommendForYou = () => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter(); // ✅ useRouter 훅 사용

  // ✅ HorizontalSliding과 동일한 동적 사이즈 계산 로직 적용
  const itemContentWidth = width * 0.5; // 화면 너비의 50%
  const imageHeight = itemContentWidth * 1.336; // 이미지 비율에 따른 높이 계산
  const itemWidth = itemContentWidth + 20; // 아이템 너비 + 좌우 마진 10*2

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      // ✅ TouchableOpacity를 사용하여 클릭 가능하게 변경
      <TouchableOpacity
        onPress={() => router.push(`/exhibition/${item.id}` as any)} // ✅ 라우팅 로직 추가
        style={[
          styles.itemContainer,
          {
            width: itemContentWidth, // ✅ 동적 너비 적용
            backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff", // ✅ 테마별 배경색
          },
        ]}
      >
        {/* ✅ 이미지 소스 및 동적 높이 적용 */}
        <Image
          source={item.image} // ✅ exhibitionData의 image 속성 사용
          style={[styles.image, { height: imageHeight }]} // ✅ 동적 높이 적용
        />
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: theme === "dark" ? "#fff" : "#1c3519" }, // ✅ 테마별 텍스트 색상
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [theme, router, itemContentWidth, imageHeight] // ✅ 종속성 추가
  );


  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={exhibitionsArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="center"
        decelerationRate="normal"
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
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    borderBottomColor: "#ddd",
    borderBottomWidth:3,
    marginBottom: 10,
  },
  flatListContent: {
    paddingHorizontal: (width - width * 0.8) / 2 - 10,
  },
  itemContainer: {
    width: width * 0.5,
    marginHorizontal: 10,
    backgroundColor: "transparent",
    borderRadius:10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: "#ddd",
    
    
  },
  image: {
    width: "80%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1, 
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginBottom: 30,
  },
});
export default RecommendForYou;
