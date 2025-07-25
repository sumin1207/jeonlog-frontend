import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

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
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1c3519",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}>
      <Tabs.Screen
        name='index'
        options={{
          headerTitle: "홈",
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
          headerTitle: "카테고리",
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
        name='search'
        options={{
          headerTitle: "검색",
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
          headerTitle: "마이페이지",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='person-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
