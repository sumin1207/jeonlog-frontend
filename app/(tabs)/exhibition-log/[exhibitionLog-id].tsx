import React, { useState, useEffect, useCallback, memo } from "react";
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
  InteractionManager,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "@/data/exhibitionsDataStorage";
import { useTheme } from "@/contexts/ThemeContext";
import Skeleton from "@/components/ui/Skeleton";
import LikeButton from "./like/LikeButton";
import CountLike from "./like/countLike";
import { useLikes } from "@/contexts/LikeContext";
import { useExhibition } from "@/contexts/ExhibitionContext";
import { Ionicons } from "@expo/vector-icons";

// Interfaces
interface Author {
  name: string;
  avatar: any;
}

interface RecordData {
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

// Style creation utility
const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF" },
    headerContainer: { flexDirection: "row", alignItems: "center", paddingTop: 30, paddingBottom: 10, paddingHorizontal: 10 },
    headerTitle: { fontSize: 22, fontWeight: "bold", color: theme === "dark" ? "#FFFFFF" : "#000000", textAlign: "center", flex: 1 },
    headerPlaceholder: { width: 28 + 10 },
    keyboardAvoidingView: { flex: 1 },
    scrollView: { paddingVertical: 16 },
    postContainer: { paddingHorizontal: 16, marginBottom: 16 },
    backButton: { padding: 8, marginLeft: -8, zIndex: 10 },
    authorContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    authorAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    authorName: { fontSize: 16, fontWeight: "600", color: theme === "dark" ? "#FFFFFF" : "#000000" },
    image: { width: "100%", height: undefined, aspectRatio: 1, borderRadius: 12, backgroundColor: theme === "dark" ? "#333" : "#E0E0E0" },
    postContent: { fontSize: 16, lineHeight: 24, color: theme === "dark" ? "#E0E0E0" : "#333333", paddingHorizontal: 16, marginBottom: 16 },
    actionBar: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 16, alignItems: "center", borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme === "dark" ? "#262626" : "#F0F0F0" },
    commentsSection: { padding: 16 },
    commentsTitle: { fontSize: 16, fontWeight: "bold", color: theme === "dark" ? "#FFFFFF" : "#000000", marginBottom: 16 },
    comment: { flexDirection: "row", marginBottom: 12 },
    commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme === "dark" ? "#333333" : "#E0E0E0", marginRight: 10 },
    commentBody: { flex: 1 },
    commentAuthor: { fontWeight: "bold", color: theme === "dark" ? "#FFFFFF" : "#000000", marginRight: 6 },
    commentText: { color: theme === "dark" ? "#E0E0E0" : "#333333", lineHeight: 18 },
    commentInputContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: theme === "dark" ? "#262626" : "#F0F0F0" },
    commentInput: { flex: 1, height: 40, color: theme === "dark" ? "#FFFFFF" : "#000000", fontSize: 16 },
    postButton: { color: "#0095F6", fontWeight: "bold", fontSize: 16 },
    loadingContainer: { padding: 16 },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    errorText: { color: "red", textAlign: 'center' },
  });

// Memoized Components
const LogHeader = memo(({ author, styles }: { author: Author | null, styles: any }) => {
  if (!author) return null;
  return (
    <View style={styles.authorContainer}>
      <Image source={author.avatar} style={styles.authorAvatar} />
      <Text style={styles.authorName}>{author.name}</Text>
    </View>
  );
});

const LogBody = memo(({ exhibition, record, styles }: { exhibition: Exhibition | null, record: RecordData | null, styles: any }) => (
  <>
    <View style={styles.postContainer}>
      {exhibition?.image && (
        <Image source={exhibition.image} style={styles.image} resizeMode='cover' />
      )}
    </View>
    <Text style={styles.postContent}>
      {String(record?.content || exhibition?.description || "내용 없음")}
    </Text>
  </>
));

const LogActionBar = memo(({ exhibitionLogId, likes, isLiked, styles }: { exhibitionLogId: string, likes: number, isLiked: boolean, styles: any }) => {
  return (
    <View style={styles.actionBar}>
      <LikeButton exhibitionLogId={exhibitionLogId} />
      <CountLike count={likes} />
    </View>
  );
});

export default function ExhibitionLogDetailScreen() {
  const params = useLocalSearchParams();
  const exhibitionLogId = params["exhibitionLog-id"] as string;
  const from = params["from"];
  const router = useRouter();

  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { userLikes } = useLikes();
  const { myLogs, isLoading: isExhibitionLoading } = useExhibition();

  const [record, setRecord] = useState<RecordData | null>(null);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 전시 기록 데이터 로딩 및 상태 업데이트
  // myLogs 또는 exhibitionLogId가 변경될 때마다 실행됩니다.
  useEffect(() => {
    if (isExhibitionLoading) return; // 전시 관련 데이터 로딩 중이면 기다림
    setIsLoading(true); // 로딩 시작

    try {
      if (!exhibitionLogId) {
        setError(`오류: 전시 기록 ID를 찾을 수 없습니다.`);
        return;
      }

      // myLogs에서 현재 전시 기록을 찾아서 record 상태 업데이트
      const currentRecord = myLogs.find((log) => log.id === exhibitionLogId) || null;
      setRecord(currentRecord);

      if (!currentRecord) {
        setError("해당 ID의 전시 기록을 찾을 수 없습니다.");
      }

      // 전시 상세 정보 로드
      const exhibitionDetails = exhibitionData[exhibitionLogId as keyof typeof exhibitionData];
      setExhibition(exhibitionDetails || null);

      // 댓글 데이터 로드
      AsyncStorage.getItem("exhibition_comments").then(commentsJSON => {
        const allComments = commentsJSON ? JSON.parse(commentsJSON) : {};
        setComments(allComments[exhibitionLogId] || []);
      });

    } catch (e) {
      console.error("데이터 로딩 중 오류 발생:", e);
      setError("데이터 로딩 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  }, [exhibitionLogId, myLogs, isExhibitionLoading]);

  useEffect(() => {
    const backAction = () => {
      if (from === "mypage") {
        router.push("/(tabs)/mypage");
        return true;
      } else {
        router.back();
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
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
      allComments[exhibitionLogId] = updatedComments;
      await AsyncStorage.setItem("exhibition_comments", JSON.stringify(allComments));
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <Skeleton style={{ width: "70%", height: 24, marginBottom: 20 }} />
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <Skeleton style={{ width: 40, height: 40, borderRadius: 20 }} />
        <Skeleton style={{ width: 100, height: 20, marginLeft: 12 }} />
      </View>
      <Skeleton style={styles.image} />
    </View>
  );

  if (isLoading || isExhibitionLoading) {
    return renderLoading();
  }

  if (error || !record) {
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name='arrow-back-circle' size={40} color='#1c3519' />
        </TouchableOpacity>
        <Text style={styles.errorText}>{error || "전시 기록을 찾을 수 없습니다."}</Text>
      </View>
    );
  }

  const author: Author | null = record.author ? record.author : { name: "userId", avatar: require("@/assets/images/mainIcon.png") };
  // 화면에 표시할 좋아요 개수: record 상태에서 직접 가져옴 (ExhibitionContext가 최신 값을 관리)
  const displayLikeCount = record?.likes || 0;
  // 사용자의 좋아요 상태: userLikes (LikeContext)에서 직접 가져옴
  const isLiked = userLikes[exhibitionLogId] === true;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name='arrow-back' size={28} color={theme === "dark" ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{record.title}</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.postContainer}>
            <LogHeader author={author} styles={styles} />
          </View>

          <LogBody exhibition={exhibition} record={record} styles={styles} />
          
          <LogActionBar exhibitionLogId={exhibitionLogId} likes={displayLikeCount} isLiked={isLiked} styles={styles} />

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
            {comments.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Image source={require("@/assets/images/mainIcon.png")} style={styles.commentAvatar} />
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
          <TouchableOpacity onPress={handleAddComment} disabled={!newComment}>
            <Text style={[styles.postButton, { opacity: newComment ? 1 : 0.5 }]}>게시</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}