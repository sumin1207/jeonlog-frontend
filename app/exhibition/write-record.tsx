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
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../contexts/ThemeContext";
import { useExhibition } from "../../contexts/ExhibitionContext";
import { useAuth } from "../../components/context/AuthContext"; // Import useAuth
import { Ionicons } from "@expo/vector-icons";
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
  const { markAsVisited, addMyLog, myLogs, myDrafts, saveDraft } =
    useExhibition();
  const { userInfo } = useAuth(); // Destructure userInfo
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  useEffect(() => {
    const loadData = () => {
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

      const existingLog = myLogs.find((log) => log.id === exhibitionId);
      if (existingLog) {
        setTitle(existingLog.title || "");
        setContent(existingLog.content || "");
        setVisibility(existingLog.visibility || "공개");
        setSelectedImages(existingLog.images || []);
        setMainImageIndex(existingLog.mainImageIndex || 0);
      } else {
        // Load draft if no submitted log exists
        const draft = myDrafts[exhibitionId];
        if (draft) {
          setTitle(draft.title || "");
          setContent(draft.content || "");
          setVisibility(draft.visibility || "공개");
          setSelectedImages(draft.images || []);
          setMainImageIndex(draft.mainImageIndex || 0);
        }
      }
      setLoading(false);
    };

    loadData();
  }, [exhibitionId, myLogs, myDrafts]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "권한 필요",
        "갤러리에 접근하려면 권한을 허용해야 합니다."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prevImages) => [...prevImages, ...uris]);
    }
  };

  const handleSetMainImage = (index: number) => {
    setMainImageIndex(index);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      // Adjust main image index if necessary
      if (mainImageIndex === index) {
        setMainImageIndex(0);
      } else if (mainImageIndex > index) {
        setMainImageIndex(mainImageIndex - 1);
      }
      return newImages;
    });
  };

  const handleSave = async () => {
    setMenuVisible(false);

    if (selectedImages.length === 0) {
      Alert.alert("오류", "이미지를 1개 이상 추가해야 합니다.");
      return;
    }

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
        images: selectedImages,
        mainImage: selectedImages[mainImageIndex],
        author: {
          name: userInfo?.name || "사용자",
          avatar: require("../../assets/images/mainIcon.png"),
        },
        likes: 0,
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

  const handleSaveDraft = async () => {
    if (!exhibitionId) {
      Alert.alert("오류", "유효하지 않은 전시 ID입니다.");
      return;
    }

    const draftData = {
      title,
      content,
      visibility,
      images: selectedImages,
      mainImageIndex,
    };
    await saveDraft(exhibitionId, draftData);
    Alert.alert("임시 저장 완료", "작성 중인 내용이 임시 저장되었습니다.");
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
      const imageSource =
        selectedImages.length > 0
          ? { uri: selectedImages[mainImageIndex] }
          : exhibition.image;
      return (
        <>
          <Image source={imageSource} style={styles.posterImage} />
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

            <ScrollView style={styles.contentContainer}>
              <TextInput
                style={[styles.contentInput, { color: textColor }]}
                placeholder="전시는 어땠나요?"
                placeholderTextColor={placeholderTextColor}
                value={content}
                onChangeText={setContent}
                multiline
              />
            </ScrollView>

            {selectedImages.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.thumbnailContainer}>
                      <Image source={{ uri }} style={styles.thumbnail} />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.mainBadge,
                          mainImageIndex === index && styles.mainBadgeSelected,
                        ]}
                        onPress={() => handleSetMainImage(index)}
                      >
                        <Text style={styles.mainBadgeText}>대표</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.toolbar, { borderTopColor: borderColor }]}>
              <View style={styles.toolbarActions}>
                <TouchableOpacity
                  style={styles.toolbarIcon}
                  onPress={handlePickImage}
                >
                  <Ionicons name="camera-outline" size={28} color={textColor} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSaveDraft}>
                <Text style={[styles.saveText, { color: textColor }]}>
                  임시저장
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100, // Ensure it has some height
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
  imagePreviewContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  thumbnailContainer: {
    marginHorizontal: 5,
    position: "relative",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
  },
  mainBadge: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  mainBadgeSelected: {
    backgroundColor: "#1c3519",
  },
  mainBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
