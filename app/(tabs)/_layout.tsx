import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
