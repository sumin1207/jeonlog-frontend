import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function WriteRecordScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { exhibitionId } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!title || !content) {
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }
    // In a real app, you would save the data to a server or local storage.
    console.log("Saving record for exhibition:", exhibitionId);
    console.log("Title:", title);
    console.log("Content:", content);
    Alert.alert("저장 완료", "기록이 성공적으로 저장되었습니다.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const isDark = theme === "dark";
  const backgroundColor = isDark ? "#1a1a1a" : "#f5f5f5";
  const textColor = isDark ? "#fff" : "#1c3519";
  const inputBackgroundColor = isDark ? "#2a2a2a" : "#fff";
  const placeholderTextColor = isDark ? "#999" : "#888";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          전시 기록하기
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[
            styles.input,
            styles.titleInput,
            { backgroundColor: inputBackgroundColor, color: textColor },
          ]}
          placeholder="제목을 입력하세요"
          placeholderTextColor={placeholderTextColor}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[
            styles.input,
            styles.contentInput,
            { backgroundColor: inputBackgroundColor, color: textColor },
          ]}
          placeholder="내용을 입력하세요"
          placeholderTextColor={placeholderTextColor}
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  titleInput: {
    height: 50,
    marginBottom: 20,
  },
  contentInput: {
    flex: 1,
    textAlignVertical: "top",
    paddingVertical: 16,
  },
});
