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
  const itemWidth = width * 0.8 + 20; // item width + margin
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => router.push(`/exhibition/${item.id}` as any)}
        style={[
          styles.itemContainer,
          { backgroundColor: theme === "dark" ? "#2a2a2a" : "#e0e0e0" },
        ]}
      >
        <Image source={item.image} style={styles.image} />
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
    [theme, router]
  );

  return (
    <View style={styles.container}>
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
        contentContainerStyle={styles.flatListContent}
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
    height: 250, // Poster(200) + Title area(50) = 250
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  flatListContent: {
    paddingHorizontal: (width - width * 0.8) / 2 - 10,
  },
  itemContainer: {
    width: width * 0.8, // 80% of screen width
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