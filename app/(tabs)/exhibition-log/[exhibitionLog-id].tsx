import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  InteractionManager,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "@/data/exhibitionsDataStorage";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "@/components/ui/TopBar";

interface Record {
  title: string;
  createdAt: string;
  content?: string; // Assuming content might be part of the record
}

interface Exhibition {
  id: string;
  title: string;
  image: any;
  description?: string; // Assuming description might be part of the exhibition
}

export default function ExhibitionLogDetailScreen() {
  const { exhibitionLogId } = useLocalSearchParams();
  console.log("Received exhibitionLogId:", exhibitionLogId);
  const { theme } = useTheme();
  const [record, setRecord] = useState<Record | null>(null);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!exhibitionLogId) {
        Alert.alert("오류", "전시 기록 ID를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      const id = exhibitionLogId as string;

      // Load record
      const savedRecordsJSON = await AsyncStorage.getItem("exhibition_records");
      const records = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};
      const currentRecord = records[id];
      setRecord(currentRecord || null);

      // Load exhibition details
      const currentExhibition =
        exhibitionData[id as keyof typeof exhibitionData];
      setExhibition(currentExhibition || null);

      // Load comments
      const savedCommentsJSON = await AsyncStorage.getItem(
        "exhibition_comments"
      );
      const allComments = savedCommentsJSON
        ? JSON.parse(savedCommentsJSON)
        : {};
      setComments(allComments[id] || []);
    } catch (error) {
      console.error("Error loading exhibition log details:", error);
      Alert.alert(
        "오류",
        "전시 기록 상세 정보를 불러오는 중 문제가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, [exhibitionLogId]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      loadData();
    });
  }, [loadData]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setNewComment("");

    try {
      const savedCommentsJSON = await AsyncStorage.getItem(
        "exhibition_comments"
      );
      const allComments = savedCommentsJSON
        ? JSON.parse(savedCommentsJSON)
        : {};
      allComments[exhibitionLogId as string] = updatedComments;
      await AsyncStorage.setItem(
        "exhibition_comments",
        JSON.stringify(allComments)
      );
    } catch (error) {
      console.error("Error saving comment:", error);
      Alert.alert("오류", "댓글 저장 중 문제가 발생했습니다.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 16,
    },
    commentsContainer: {
      marginTop: 24,
    },
    commentsTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 16,
    },
    comment: {
      fontSize: 14,
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333333" : "#EEEEEE",
      paddingBottom: 8,
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#333333" : "#EEEEEE",
    },
    commentInput: {
      flex: 1,
      height: 40,
      backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
      borderRadius: 20,
      paddingHorizontal: 16,
      color: theme === "dark" ? "#FFFFFF" : "#000000",
    },
    commentSubmitButton: {
      marginLeft: 8,
      padding: 8,
    },
    commentSubmitText: {
      fontSize: 16,
      color: "#007AFF",
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
    },
    loadingText: {
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      fontSize: 18,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
    },
    errorText: {
      color: "red",
      fontSize: 18,
      textAlign: "center",
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (!record && !exhibition) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>전시 기록을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {exhibition?.image && (
              <Image source={exhibition.image} style={styles.image} />
            )}
            <Text style={styles.title}>
              {record?.title || exhibition?.title || "제목 없음"}
            </Text>
            {record?.content && (
              <Text style={styles.description}>{record.content}</Text>
            )}
            {exhibition?.description && !record?.content && (
              <Text style={styles.description}>{exhibition.description}</Text>
            )}

            <View style={styles.commentsContainer}>
              <Text style={styles.commentsTitle}>댓글</Text>
              {comments.length === 0 ? (
                <Text style={styles.comment}>아직 댓글이 없습니다.</Text>
              ) : (
                comments.map((comment, index) => (
                  <Text key={comment} style={styles.comment}>
                    {comment}
                  </Text>
                ))
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요..."
            placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            style={styles.commentSubmitButton}
          >
            <Text style={styles.commentSubmitText}>등록</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
