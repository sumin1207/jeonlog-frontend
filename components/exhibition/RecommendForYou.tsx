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

//임시 추천 전시
const originalRecommendations = [
  {
    id: "rec-1",
    title: "추천 1",
    imageUrl: "https://via.placeholder.com/300x200/FF5733/FFFFFF?text=rec-1",
  },
  {
    id: "rec-2",
    title: "추천 2",
    imageUrl: "https://via.placeholder.com/300x200/33FF57/FFFFFF?text=rec-2",
  },
  {
    id: "rec-3",
    title: "추천 3",
    imageUrl: "https://via.placeholder.com/300x200/3357FF/FFFFFF?text=rec-3",
  },
  {
    id: "rec-4",
    title: "추천 4",
    imageUrl: "https://via.placeholder.com/300x200/F0FF33/FFFFFF?text=4",
  },
  {
    id: "rec-5",
    title: "추천 5",
    imageUrl:
      "https://via.placeholder.com/300x200/FF33F0/FFFFFF?text=Exhibition+5",
  },
];

const RecommendForYou = () => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const itemWidth = width * 0.8 + 20; //아이템 너비 + 마진

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View
        style={[
          styles.itemContainer,
          { backgroundColor: theme === "dark" ? "#2a2a2a" : "#e0e0e0" },
        ]}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
        data={originalRecommendations}
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
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  flatListContent: {
    paddingHorizontal: (width - width * 0.8) / 2 - 10,
  },
  itemContainer: {
    width: width * 0.5,
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
export default RecommendForYou;
