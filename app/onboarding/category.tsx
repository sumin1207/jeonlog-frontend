import { useRouter } from "expo-router";
import { Button, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function CategoryPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selected, setSelected] = useState<{
    exhibition: boolean;
    play: boolean;
  }>({
    exhibition: false,
    play: false,
  });

  const handleSelect = (key: "exhibition" | "play") => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const canProceed = selected.exhibition || selected.play;

  return (
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
        추천 받고 싶은 {"\n"}카테고리를 선택해주세요
      </Text>

      {/* 카테고리 선택 UI는 추후 추가 */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          marginBottom: 8,
        }}>
        <TouchableOpacity
          style={[
            styles.categoryButtonBase,
            selected.exhibition
              ? styles.categoryButtonSelected
              : styles.categoryButtonUnselected,
          ]}
          onPress={() => handleSelect("exhibition")}>
          <Text
            style={{
              color: selected.exhibition ? "#1c3519" : "#d2d2d2",
              fontSize: 18,
            }}>
            전시
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButtonBase,
            selected.play
              ? styles.categoryButtonSelected
              : styles.categoryButtonUnselected,
          ]}
          onPress={() => handleSelect("play")}>
          <Text
            style={{
              color: selected.play ? "#1c3519" : "#d2d2d2",
              fontSize: 18,
            }}>
            연극
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignSelf: "flex-start", marginBottom: 30 }}>
        <Text
          style={{
            color: theme === "dark" ? "#ccc" : "#7e7e7e",
            fontSize: 12,
            fontWeight: "normal",
            marginTop: 30,
            textAlign: "left",
          }}>
          둘 다 선택 가능
        </Text>
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextButtonBase,
          selected.exhibition || selected.play
            ? styles.nextButtonActive
            : styles.nextButtonDisabled,
          !canProceed && styles.nextButtonDisabled,
          styles.nextButtonFixed,
        ]}
        onPress={() => router.replace("/onboarding/interest")}
        disabled={!canProceed}>
        <Text style={styles.nextButtonText}>다음으로 넘어가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20, // 좌우 여백 추가
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  categoryButtonContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 100, // 버튼과 다음 버튼 사이 여백 증가
  },
  categoryButtonBase: {
    borderWidth: 2,
    borderColor: "#d2d2d2", // 항상 같은 테두리 색상
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120, // 버튼 최소 너비 설정으로 일관성 유지
  },
  categoryButtonSelected: {
    borderColor: "#234024",
  },
  categoryButtonUnselected: {
    backgroundColor: "#white",
  },
  categoryTextBase: {
    fontSize: 18,
  },
  categoryTextSelected: {
    color: "#1c3519",
  },
  categoryTextUnselected: {
    color: "#d2d2d2",
  },
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
