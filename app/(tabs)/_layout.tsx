import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useRouter } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/design-system/theme";
import { useColorScheme } from "@/components/hooks/useColorScheme";
import { useClientOnlyValue } from "@/components/hooks/useClientOnlyValue";
import { useTheme } from "@/contexts/ThemeContext";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return (
    <FontAwesome
      size={28}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.main,
        tabBarInactiveTintColor:
          theme === "dark" ? Colors.neutral.gray600 : Colors.neutral.gray500,
        headerShown: false,
        tabBarStyle: {
          backgroundColor:
            theme === "dark"
              ? Colors.background.cardDark
              : Colors.background.card,
          borderTopColor:
            theme === "dark" ? Colors.neutral.gray800 : Colors.neutral.gray300,
        },
      }}
      initialRouteName='home'>
      <Tabs.Screen
        name='home'
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='home-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='category'
        options={{
          title: "카테고리",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='grid-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='exhibition-log'
        options={{
          title: "전시 기록",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='images-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: "검색",
          href: null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='search-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='mypage'
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='person-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='category/[type]'
        options={{ href: null }}
      />
      <Tabs.Screen
        name='museum/[name]'
        options={{ href: null }}
      />
      {/* exhibition-log/[exhibitionLog-id]는 exhibition-log/_layout.tsx에서 이미 정의되어 있음 */}
    </Tabs>
  );
}
