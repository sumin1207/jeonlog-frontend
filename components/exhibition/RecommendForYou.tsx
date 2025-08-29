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
import { Colors } from "../../design-system/theme";
import { Spacing } from "../../design-system/theme";

const { width } = Dimensions.get("window");
const exhibitionsArray = Object.values(exhibitionData);

const RecommendForYou = () => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const itemContentWidth = width * 0.5;
  const imageHeight = itemContentWidth * 1.336;
  const itemWidth = itemContentWidth + 20; // item width + margin
  // 카드 크기 조정 - 이미지에서 보이는 것처럼
  //  const itemContentWidth = width * 0.35; // 화면 너비의 35%로 조정
  //  const imageHeight = itemContentWidth * 1.2; // 이미지 높이 비율 조정
  //  const itemWidth = itemContentWidth + 20; // 아이템 너비 + 좌우 마진

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => router.push(`/exhibition/${item.id}` as any)}
        style={[
          styles.itemContainer,
          {
            width: itemContentWidth,
            backgroundColor:
              theme === "dark"
                ? Colors.background.cardDark
                : Colors.background.card,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text
            style={[
              styles.title,
              {
                color:
                  theme === "dark"
                    ? Colors.text.dark.primary
                    : Colors.text.primary,
              },
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {item.location && (
            <Text
              style={[
                styles.location,
                {
                  color:
                    theme === "dark"
                      ? Colors.text.dark.secondary
                      : Colors.text.secondary,
                },
              ]}
              numberOfLines={1}
            >
              {item.location}
            </Text>
          )}

          {item.date && (
            <Text
              style={[
                styles.date,
                {
                  color:
                    theme === "dark"
                      ? Colors.text.dark.secondary
                      : Colors.text.secondary,
                },
              ]}
              numberOfLines={1}
            >
              {item.date}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    [theme, router, itemContentWidth, imageHeight]
  );

  return (
    <View style={[styles.container, { height: imageHeight + 100 }]}>
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
        contentContainerStyle={{
          paddingLeft: (width - itemContentWidth) / 2 - 125,
          paddingRight: 10,
        }}
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 7,
    marginBottom: 10,
  },

  itemContainer: {
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    resizeMode: "cover",
  },

  contentContainer: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: Spacing.xs,
    lineHeight: 16,
    textAlign: "left",
  },

  location: {
    fontSize: 10,
    marginBottom: Spacing.xs,
    lineHeight: 14,
    textAlign: "left",
  },

  date: {
    fontSize: 9,
    lineHeight: 12,
    textAlign: "left",
  },
});

export default RecommendForYou;
