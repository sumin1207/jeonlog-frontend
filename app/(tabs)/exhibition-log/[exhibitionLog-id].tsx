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
  Pressable,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "@/data/exhibitionsDataStorage";
import { useTheme } from "@/contexts/ThemeContext";
import BackButton from "@/components/ui/BackButton";
import Skeleton from "@/components/ui/Skeleton";
import LikeButton from "./like/LikeButton";
import CountLike from "./like/countLike";
import { useLikes } from "@/contexts/LikeContext";
import { useExhibition } from "@/contexts/ExhibitionContext";
import { Ionicons } from "@expo/vector-icons";

interface Author {
  name: string;
  avatar: any;
}

interface Record {
  title: string;
  createdAt: string;
  content?: string;
  likes?: number;
  isLiked?: boolean;
  author?: Author;
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
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 30,
      paddingBottom: 10,
      paddingHorizontal: 10,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      textAlign: "center",
      flex: 1,
    },
    headerPlaceholder: {
      width: 28 + 10, //아이콘 사이즈+padding
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      paddingVertical: 16,
    },
    postContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    backButton: {
      padding: 8,
      marginLeft: -8,
      zIndex: 10,
    },
    postTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 16,
      marginTop: 50, //뒤로가기 버튼과 마진
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    authorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    authorName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#FFFFFF" : "#000000",
    },
    image: {
      width: "100%",
      height: undefined,
      aspectRatio: 1,
      borderRadius: 12,
      backgroundColor: theme === "dark" ? "#333" : "#E0E0E0",
    },
    postContent: {
      fontSize: 16,
      lineHeight: 24,
      color: theme === "dark" ? "#E0E0E0" : "#333333",
      paddingHorizontal: 16,
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
      width: 32,
      height: 32,
      borderRadius: 16,
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
  const params = useLocalSearchParams();
  const exhibitionLogId = params["exhibitionLog-id"];
  const from = params["from"];
  const router = useRouter();

  console.log("ExhibitionLogDetailScreen received ID:", exhibitionLogId);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { userLikes } = useLikes();
  const { myLogs, isLoading: isExhibitionLoading } = useExhibition();

  const [record, setRecord] = useState<Record | null>(null);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (isExhibitionLoading) {
      return;
    }
    setIsLoading(true);
    try {
      if (!exhibitionLogId) {
        setError(
          `오류: 전시 기록 ID를 찾을 수 없습니다. ID: ${exhibitionLogId}`
        );
        setIsLoading(false);
        return;
      }
      const id = exhibitionLogId as string;

      const currentRecord = myLogs.find((log) => log.id === id) || null;
      setRecord(currentRecord);

      if (!currentRecord) {
        setError("해당 ID의 전시 기록을 찾을 수 없습니다.");
      }

      if (currentRecord && currentRecord.author) {
        setAuthor(currentRecord.author);
      } else {
        setAuthor({
          name: "userId",
          avatar: require("@/assets/images/mainIcon.png"),
        });
      }

      const exhibitionDetails =
        exhibitionData[id as keyof typeof exhibitionData];
      setExhibition(exhibitionDetails || null);

      const commentsJSON = await AsyncStorage.getItem("exhibition_comments");
      const allComments = commentsJSON ? JSON.parse(commentsJSON) : {};
      setComments(allComments[id] || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("데이터 로딩 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [exhibitionLogId, myLogs, isExhibitionLoading]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      loadData();
    });
    return () => task.cancel();
  }, [loadData]);

  // 하드웨어 뒤로가기 버튼 제어
  useEffect(() => {
    const backAction = () => {
      if (from === "mypage") {
        router.push("/(tabs)/mypage");
        return true; // 기본 동작 방지
      } else {
        return false; // 기본 동작 허용 (router.back())
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [from, router]);

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
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}>
        <Skeleton style={{ width: 40, height: 40, borderRadius: 20 }} />
        <Skeleton style={{ width: 100, height: 20, marginLeft: 12 }} />
      </View>
      <Skeleton style={styles.image} />
      <Skeleton style={{ width: "100%", height: 20, marginTop: 16 }} />
      <Skeleton style={{ width: "80%", height: 20, marginTop: 8 }} />
    </View>
  );

  if (isLoading || isExhibitionLoading) {
    return renderLoading();
  }

  if (error || !record) {
    return (
      <View style={styles.errorContainer}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons
            name='arrow-back-circle'
            size={40}
            color='#1c3519'
          />
        </Pressable>
        <Text style={styles.errorText}>
          {error || "전시 기록을 찾을 수 없습니다."}
        </Text>
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (from === "mypage") {
                  router.push("/(tabs)/mypage");
                } else {
                  router.back();
                }
              }}>
              <Ionicons
                name='arrow-back'
                size={28}
                color={theme === "dark" ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}>
              {String(record?.title)}
            </Text>
            <View style={styles.headerPlaceholder} />
          </View>
          <View style={styles.postContainer}>
            {author && (
              <View style={styles.authorContainer}>
                <Image
                  source={author.avatar}
                  style={styles.authorAvatar}
                />
                <Text style={styles.authorName}>{author.name}</Text>
              </View>
            )}
          </View>

          <View style={styles.postContainer}>
            {exhibition?.image && (
              <Image
                source={exhibition.image}
                style={styles.image}
                resizeMode='cover'
              />
            )}
          </View>
          <Text style={styles.postContent}>
            {String(record?.content || exhibition?.description || "내용 없음")}
          </Text>
          <View style={styles.actionBar}>
            <LikeButton exhibitionLogId={id} />
            <CountLike count={displayLikeCount} />
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
            {comments.map((comment, index) => (
              <View
                key={index}
                style={styles.comment}>
                <Image
                  source={require("@/assets/images/mainIcon.png")}
                  style={styles.commentAvatar}
                />
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
            placeholder='댓글 달기...'
            placeholderTextColor={theme === "dark" ? "#8E8E8E" : "#A9A9A9"}
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment}>
            <Text
              style={[styles.postButton, { opacity: newComment ? 1 : 0.5 }]}>
              게시
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
