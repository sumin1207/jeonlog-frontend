import React, { useRef, useCallback } from "react";
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
import { exhibitionData } from "../../data/exhibitionsDataStorage"; // Import from central data source

const { width } = Dimensions.get("window");

// Convert the exhibition data object to an array
const exhibitionsArray = Object.values(exhibitionData);

const HorizontalSliding = () => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  // Calculate dynamic dimensions
  const itemContentWidth = width * 0.5;
  const imageHeight = itemContentWidth * 1.336;
  const itemWidth = itemContentWidth + 20; // item width + margin

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => router.push(`/exhibition/${item.id}` as any)}
        style={[
          styles.itemContainer,
          {
            width: itemContentWidth,
            backgroundColor: theme === "dark" ? "#transparent" : "#transparent",
          },
        ]}
      >
        <Image
          source={item.image}
          style={[styles.image, { height: imageHeight }]}
        />
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: theme === "dark" ? "#fff" : "#1c3519" },
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [theme, router, itemContentWidth, imageHeight]
  );

  return (
    <View style={[styles.container, { height: imageHeight + 50 }]}>
      <FlatList
        ref={flatListRef}
        data={exhibitionsArray} // Use the array from the central data source
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="center"
        decelerationRate="normal"
        contentContainerStyle={{
          paddingLeft: (width - itemContentWidth) / 2 - 50,
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
    borderBottomColor: "#ddd",
    borderBottomWidth:3,
    
  },
  
  itemContainer: {
    marginHorizontal: 10,
    backgroundColor: "#fff",
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
    height: 200, // ✅ 이미지의 높이를 유지합니다.
    resizeMode: "cover", // ✅ 이미지 비율 유지 및 채우기 (contain도 가능)
    borderRadius: 10, // ✅ 여기에서 이미지를 둥글게 만듭니다.
    borderWidth: 1, // 테두리 두께 (예: 1픽셀)
    borderColor: "#ddd", // 테두리 색상 (테마에 따라 다르게 설정)
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",

  },
  titleContainer: {
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
});

export default HorizontalSliding;