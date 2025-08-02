import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const router = useRouter();
  const [isSearchPressed, setIsSearchPressed] = useState(false);

  // 애니메이션 값들
  const searchButtonScale = useRef(new Animated.Value(1)).current;
  const searchButtonOpacity = useRef(new Animated.Value(1)).current;
  const searchIconRotation = useRef(new Animated.Value(0)).current;

  const handleLogoPress = () => {
    router.replace("/(tabs)/home");
  };

  const handleSearchPress = () => {
    // 버튼 클릭 애니메이션
    setIsSearchPressed(true);

    Animated.parallel([
      // 스케일 애니메이션 (눌렀다가 돌아오기)
      Animated.sequence([
        Animated.timing(searchButtonScale, {
          toValue: 0.2,
          duration: 10,
          useNativeDriver: true,
        }),
        Animated.timing(searchButtonScale, {
          toValue: 1,
          duration: 10,
          useNativeDriver: true,
        }),
      ]),
      // 투명도 애니메이션 (깜빡임 효과)
      Animated.sequence([
        Animated.timing(searchButtonOpacity, {
          toValue: 0.5,
          duration: 10,
          useNativeDriver: true,
        }),
        Animated.timing(searchButtonOpacity, {
          toValue: 1,
          duration: 10,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // 애니메이션 완료 후 검색 화면으로 이동
      router.replace("/(tabs)/search" as any);

      // 상태 초기화
      setTimeout(() => {
        setIsSearchPressed(false);
        searchIconRotation.setValue(0);
      }, 100);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Pressable onPress={handleLogoPress}>
          <Image
            source={require("../../assets/images/topBar.png")}
            style={styles.logoImage}
            resizeMode='contain'
          />
        </Pressable>
      </View>
      <View style={styles.rightContainer}>
        <Animated.View
          style={[
            styles.searchButtonContainer,
            {
              transform: [{ scale: searchButtonScale }],
              opacity: searchButtonOpacity,
            },
          ]}>
          <Pressable
            style={styles.searchButton}
            onPress={handleSearchPress}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: searchIconRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}>
              <Ionicons
                name='search-outline'
                size={24}
                color={isSearchPressed ? "#4CAF50" : "white"}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: "#1c3519",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -30,
  },
  logoImage: {
    width: 200,
    height: 50,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchButtonContainer: {
    borderRadius: 20,
    marginRight: 20,
    overflow: "hidden",
  },
  searchButton: {
    padding: 8,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
