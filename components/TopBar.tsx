import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const router = useRouter();

  const handleLogoPress = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Pressable onPress={handleLogoPress}>
          <Image
            source={require("../assets/images/tobBar.png")}
            style={styles.logoImage}
            resizeMode='contain'
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "#1c3519",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -50,
  },
  logoImage: {
    width: 240,
    height: 60,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
