import React, { useState, useRef } from "react";
import { View, Text, Image, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBarStyles } from "../../design-system/styles/TopBarStyles";
import { Colors } from "../../design-system/theme";

interface TopBarProps {
  title?: string;
  right?: React.ReactNode;
}

export default function TopBar({ title, right }: TopBarProps) {
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
    <View style={TopBarStyles.container}>
      <View style={TopBarStyles.logoContainer}>
        <Pressable onPress={handleLogoPress}>
          <Image
            source={require("../../assets/images/topBar.png")}
            style={TopBarStyles.logoImage}
            resizeMode='contain'
          />
        </Pressable>
      </View>
      <View style={TopBarStyles.rightContainer}>
        {right ? (
          right
        ) : (
          <Animated.View
            style={[
              TopBarStyles.searchButtonContainer,
              {
                transform: [{ scale: searchButtonScale }],
                opacity: searchButtonOpacity,
              },
            ]}>
            <Pressable
              style={TopBarStyles.searchButton}
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
                  color={
                    isSearchPressed
                      ? Colors.secondary.main
                      : Colors.primary.contrast
                  }
                />
              </Animated.View>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
