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
import TopBar from "@/components/ui/TopBar";
import Skeleton from "@/components/ui/Skeleton";
import LikeButton from "./like/LikeButton";
import CountLike from "./like/countLike";
import { useLikes } from "@/contexts/LikeContext";

interface Record {
  title: string;
  createdAt: string;
  content?: string;
  likes?: number;
  isLiked?: boolean;
}

interface Exhibition {
  id: string;
  title: string;
  image: any;
  description?: string;
}

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      paddingVertical: 16,
    },
    postContainer: {
      paddingHorizontal: 16,
    },
    postTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 16,
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    authorAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme === "dark" ? "#333333" : "#E0E0E0",
      marginRight: 12,
    },
    authorName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
    },
    image: {
      width: "100%",
      aspectRatio: 4 / 3,
      borderRadius: 12,
      backgroundColor: theme === "dark" ? "#333" : "#E0E0E0",
    },
    postContent: {
      fontSize: 15,
      lineHeight: 22,
      color: theme === "dark" ? "#E0E0E0" : "#333333",
      marginBottom: 16,
    },
    actionBar: {
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme === "dark" ? "#262626" : "#F0F0F0",
    },
    actionIcon: {
      marginRight: 16,
    },
    commentsSection: {
      padding: 16,
    },
    commentsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 16,
    },
    comment: {
      flexDirection: "row",
      marginBottom: 12,
    },
    commentAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme === "dark" ? "#333333" : "#E0E0E0",
      marginRight: 10,
    },
    commentBody: {
      flex: 1,
    },
    commentAuthor: {
      fontWeight: "bold",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginRight: 6,
    },
    commentText: {
      color: theme === "dark" ? "#E0E0E0" : "#333333",
      lineHeight: 18,
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#262626" : "#F0F0F0",
    },
    commentInput: {
      flex: 1,
      height: 40,
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      fontSize: 16,
    },
    postButton: {
      color: "#0095F6",
      fontWeight: "bold",
      fontSize: 16,
    },
    loadingContainer: {
      padding: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: "red",
    },
  });

export default function ExhibitionLogDetailScreen() {
  const { exhibitionLogId } = useLocalSearchParams();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { userLikes } = useLikes();

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
        return;
      }
      const id = exhibitionLogId as string;
      const recordsJSON = await AsyncStorage.getItem("exhibition_records");
      const records = recordsJSON ? JSON.parse(recordsJSON) : {};
      setRecord(records[id] || null);

      const exhibitionDetails =
        exhibitionData[id as keyof typeof exhibitionData];
      setExhibition(exhibitionDetails || null);

      const commentsJSON = await AsyncStorage.getItem("exhibition_comments");
      const allComments = commentsJSON ? JSON.parse(commentsJSON) : {};
      setComments(allComments[id] || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [exhibitionLogId]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      loadData();
    });
    return () => task.cancel();
  }, [loadData]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setNewComment("");
    try {
      const commentsJSON = await AsyncStorage.getItem("exhibition_comments");
      const allComments = commentsJSON ? JSON.parse(commentsJSON) : {};
      allComments[exhibitionLogId as string] = updatedComments;
      await AsyncStorage.setItem(
        "exhibition_comments",
        JSON.stringify(allComments)
      );
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <Skeleton style={{ width: "70%", height: 24, marginBottom: 20 }} />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <Skeleton style={{ width: 32, height: 32, borderRadius: 16 }} />
        <Skeleton style={{ width: 100, height: 20, marginLeft: 12 }} />
      </View>
      <Skeleton style={styles.image} />
      <Skeleton style={{ width: "100%", height: 20, marginTop: 16 }} />
      <Skeleton style={{ width: "80%", height: 20, marginTop: 8 }} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopBar />
        {renderLoading()}
      </View>
    );
  }

  if (!record && !exhibition) {
    return (
      <View style={styles.errorContainer}>
        <TopBar />
        <Text style={styles.errorText}>전시 기록을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const id = exhibitionLogId as string;
  const isInitiallyLiked = record?.isLiked || false;
  const initialLikes = record?.likes || 0;

  const hasUserInteracted = userLikes[id] !== undefined;
  const isLiked = hasUserInteracted ? userLikes[id]! : isInitiallyLiked;

  let displayLikeCount = initialLikes;
  if (isInitiallyLiked && !isLiked) {
    displayLikeCount = initialLikes - 1;
  } else if (!isInitiallyLiked && isLiked) {
    displayLikeCount = initialLikes + 1;
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>
              {record?.title || "사용자 지정 제목 없음"}
            </Text>
            <View style={styles.authorContainer}>
              <View style={styles.authorAvatar} />
              <Text style={styles.authorName}>user</Text>
            </View>
          </View>

          <View style={styles.postContainer}>
                    {exhibition?.image && (
              <Image
                source={exhibition.image}
                style={[
                  styles.image,
                  {
                    width: "100%",
                    height: undefined,
                    aspectRatio: 1.33,
                    alignSelf: "center",
                    maxHeight: 300,
                  },
                ]}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={styles.postContent}>
            {record?.content || exhibition?.description || "내용 없음"}
          </Text>
          <View style={styles.actionBar}>
            <LikeButton exhibitionLogId={id} />
            <CountLike count={displayLikeCount} />
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
            {comments.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentBody}>
                  <Text style={styles.commentText}>
                    <Text style={styles.commentAuthor}>익명 </Text>
                    {comment}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글 달기..."
            placeholderTextColor={theme === "dark" ? "#8E8E8E" : "#A9A9A9"}
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity onPress={handleAddComment} disabled={!newComment}>
            <Text
              style={[styles.postButton, { opacity: newComment ? 1 : 0.5 }]}
            >
              게시
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
