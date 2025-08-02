import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const router = useRouter();

  const handleLogoPress = () => {
    router.replace("/(tabs)/home");
  };

  const handleSearchPress = () => {
    router.replace("/(tabs)/search" as any);
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
        <Pressable
          style={styles.searchButton}
          onPress={handleSearchPress}>
          <Ionicons
            name='search-outline'
            size={24}
            color='white'
          />
        </Pressable>
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
  searchButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 20,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
