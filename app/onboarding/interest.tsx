import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Stack } from "expo-router";

const images: { id: keyof typeof initialSelected; uri: string }[] = [
  { id: "one", uri: "https://via.placeholder.com/150?text=전시" },
  { id: "two", uri: "https://via.placeholder.com/150?text=연극" },
  { id: "three", uri: "https://via.placeholder.com/150?text=뮤지컬" },
  { id: "four", uri: "https://via.placeholder.com/150?text=무용" },
];

const initialSelected = {
  one: false,
  two: false,
  three: false,
  four: false,
};

export default function InterestPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selected, setSelected] =
    useState<typeof initialSelected>(initialSelected);

  const handleSelect = (id: keyof typeof selected) => {
    setSelected((prev: typeof initialSelected) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const canProceed = Object.values(selected).some((v) => v === true);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          paddingTop: 54,
          paddingHorizontal: 32,
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
        }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            alignItems: "flex-start",
            marginBottom: 52,
            textAlign: "left",
            color: theme === "dark" ? "#fff" : "#1c3519",
          }}>
          관심 있는 전시/연극을 선택해주세요
        </Text>
        {/* 위쪽 두 개 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 20,
          }}>
          {images
            .slice(0, 2)
            .map(({ id, uri }: { id: keyof typeof selected; uri: string }) => (
              <TouchableOpacity
                key={id}
                onPress={() => handleSelect(id)}>
                <Image
                  source={{ uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    borderWidth: 4,
                    borderColor: selected[id] ? "#1c3519" : "#7e7e7e",
                  }}
                />
              </TouchableOpacity>
            ))}
        </View>
        {/* 아래쪽 두 개 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 20,
          }}>
          {images
            .slice(2, 4)
            .map(({ id, uri }: { id: keyof typeof selected; uri: string }) => (
              <TouchableOpacity
                key={id}
                onPress={() => handleSelect(id)}>
                <Image
                  source={{ uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    borderWidth: 4,
                    borderColor: selected[id] ? "#1c3519" : "#7e7e7e",
                  }}
                />
              </TouchableOpacity>
            ))}
        </View>
        <View style={{ alignSelf: "flex-start", marginBottom: 10 }}>
          <Text
            style={{
              color: "#7e7e7e",
              fontSize: 12,
              fontWeight: "normal",
              marginTop: 30,
              textAlign: "left",
            }}>
            한 개 이상 선택
          </Text>
        </View>
        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[
            styles.nextButtonBase,
            canProceed ? styles.nextButtonActive : styles.nextButtonDisabled,
            !canProceed && styles.nextButtonDisabled,
            styles.nextButtonFixed,
          ]}
          onPress={() => router.replace("/(tabs)/home")}
          disabled={!canProceed}>
          <Text style={styles.nextButtonText}>다음으로 넘어가기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  nextButtonBase: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200, // 조금 더 넉넉하게
  },
  nextButtonActive: {
    backgroundColor: "#1c3519",
  },
  nextButtonDisabled: {
    backgroundColor: "#d2d2d2",
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  nextButtonFixed: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
});
