import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useExhibition } from "../../contexts/ExhibitionContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exhibitionData } from "../../data/exhibitionsDataStorage"; // Import from central data source

type Visibility = "공개" | "팔로워만 공개" | "비공개";

const getExhibitionId = (
  id: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(id)) {
    return id[0];
  }
  return id;
};

export default function WriteRecordScreen() {
  const { theme } = useTheme();
  const { markAsVisited, addMyLog } = useExhibition();
  const router = useRouter();
  const params = useLocalSearchParams();
  const exhibitionId = getExhibitionId(params.exhibitionId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [exhibition, setExhibition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("공개");
  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchAndLoadRecord = async () => {
      if (!exhibitionId) {
        setError("전시 ID가 없습니다.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const data = exhibitionData[exhibitionId as keyof typeof exhibitionData];
      if (data) {
        setExhibition(data);
      } else {
        setError("전시 정보를 찾을 수 없습니다.");
      }
      setLoading(false);

      try {
        const savedRecords = await AsyncStorage.getItem("exhibition_records");
        if (savedRecords) {
          const records = JSON.parse(savedRecords);
          const record = records[exhibitionId];
          if (record) {
            setTitle(record.title || "");
            setContent(record.content || "");
            setVisibility(record.visibility || "공개");
          }
        }
      } catch (e) {
        console.error("Failed to load record:", e);
      }
    };

    fetchAndLoadRecord();
  }, [exhibitionId]);

  const handleSave = async () => {
    setMenuVisible(false); // Close menu before showing alert

    if (!title || !content) {
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (!exhibitionId) {
      Alert.alert("오류", "유효하지 않은 전시 ID입니다.");
      return;
    }

    try {
      const hashtags = [];
    const regex = /#([a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_]+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }
    const newRecord = {
      title,
      content,
      createdAt: new Date().toISOString(),
      hashtags,
      visibility,
    };

      await addMyLog(exhibitionId, newRecord);
      markAsVisited(exhibitionId);

      Alert.alert("등록 완료", "게시글이 등록되었습니다!", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)/mypage");
          },
        },
      ]);
    } catch (e) {
      Alert.alert("오류", "기록을 저장하는 데 실패했습니다.");
    }
  };

  const handleVisibilityChange = (newVisibility: Visibility) => {
    setVisibility(newVisibility);
    setMenuVisible(false);
  };

  const isDark = theme === "dark";
  const backgroundColor = isDark ? "#121212" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const placeholderTextColor = isDark ? "#A9A9A9" : "#A9A9A9";
  const borderColor = isDark ? "#272727" : "#E5E5E5";
  const menuBackgroundColor = isDark ? "#2C2C2C" : "#FFFFFF";
  const menuBorderColor = isDark ? "#4A4A4A" : "#DCDCDC";
  const selectedItemColor = "#1c3519";

  const renderExhibitionInfo = () => {
    if (loading) {
      return (
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color={textColor}
        />
      );
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (exhibition) {
      return (
        <>
          <Image source={exhibition.image} style={styles.posterImage} />
          <View style={styles.exhibitionDetails}>
            <Text
              style={[styles.exhibitionTitle, { color: textColor }]}
              numberOfLines={2}
            >
              {exhibition.title}
            </Text>
            <Text style={styles.exhibitionDate}>{exhibition.date}</Text>
          </View>
        </>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={{ flex: 1 }}>
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.headerButton, { color: textColor }]}>
                  취소
                </Text>
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <TouchableOpacity
                  style={styles.visibilityButton}
                  onPress={() => setMenuVisible((prev) => !prev)}
                >
                  <Text style={[styles.visibilityText, { color: textColor }]}>
                    {visibility}
                  </Text>
                  <Ionicons
                    name={isMenuVisible ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={textColor}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.headerButton, styles.registerButton]}>
                  등록
                </Text>
              </TouchableOpacity>
            </View>

            {isMenuVisible && (
              <View
                style={[
                  styles.menuContainer,
                  {
                    backgroundColor: menuBackgroundColor,
                    borderColor: menuBorderColor,
                  },
                ]}
              >
                {(["공개", "팔로워만 공개", "비공개"] as Visibility[]).map(
                  (option, index) => (
                    <React.Fragment key={option}>
                      <TouchableOpacity
                        style={[
                          styles.menuItem,
                          visibility === option && {
                            backgroundColor: selectedItemColor,
                          },
                        ]}
                        onPress={() => handleVisibilityChange(option)}
                      >
                        <Text
                          style={[
                            styles.menuItemText,
                            {
                              color:
                                visibility === option ? "#FFFFFF" : textColor,
                            },
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                      {index < 2 && (
                        <View
                          style={[
                            styles.separator,
                            { backgroundColor: menuBorderColor },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  )
                )}
              </View>
            )}

            <View
              style={[
                styles.exhibitionContainer,
                { borderBottomColor: borderColor },
              ]}
            >
              {renderExhibitionInfo()}
            </View>

            <View
              style={[
                styles.titleInputContainer,
                { borderBottomColor: borderColor },
              ]}
            >
              <TextInput
                style={[styles.titleInput, { color: textColor }]}
                placeholder="제목을 입력하세요"
                placeholderTextColor={placeholderTextColor}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.contentContainer}>
              <TextInput
                style={[styles.contentInput, { color: textColor }]}
                placeholder="전시는 어땠나요?"
                placeholderTextColor={placeholderTextColor}
                value={content}
                onChangeText={setContent}
                multiline
              />
            </View>

            <View style={[styles.toolbar, { borderTopColor: borderColor }]}>
              <View style={styles.toolbarActions}>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <Ionicons name="camera-outline" size={28} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <Ionicons name="text" size={28} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <MaterialCommunityIcons
                    name="format-align-left"
                    size={28}
                    color={textColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <Ionicons name="happy-outline" size={28} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <Ionicons
                    name="ellipsis-horizontal-circle-outline"
                    size={28}
                    color={textColor}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Text style={[styles.saveText, { color: textColor }]}>
                  저장
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerButton: {
    fontSize: 16,
  },
  registerButton: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  visibilityButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  visibilityText: {
    fontSize: 14,
    marginRight: 4,
  },
  menuContainer: {
    position: "absolute",
    top: 55,
    alignSelf: "center",
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 20,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    width: "100%",
  },
  exhibitionContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    minHeight: 122,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    alignSelf: "center",
  },
  posterImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 16,
  },
  exhibitionDetails: {
    flex: 1,
    justifyContent: "center",
  },
  exhibitionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  exhibitionDate: {
    fontSize: 12,
    color: "gray",
  },
  titleInputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarIcon: {
    marginHorizontal: 10,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
