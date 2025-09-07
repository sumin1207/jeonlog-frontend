import React, { useState } from "react";
import { TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useExhibition } from "../../contexts/ExhibitionContext";
import { useAuth } from "../../components/context/AuthContext";
import { Colors } from "../../design-system/theme";

interface BookmarkButtonProps {
  exhibitionId: string;
  size?: number;
  color?: string;
  activeColor?: string;
  style?: any;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  showAlert?: boolean;
}

export default function BookmarkButton({
  exhibitionId,
  size = 24,
  color = Colors.text.secondary,
  activeColor = Colors.primary.main,
  style,
  onBookmarkChange,
  showAlert = true,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmarkedWithAPI } = useExhibition();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (isLoading) return;

    // 로그인 상태 확인
    if (!isLoggedIn) {
      if (showAlert) {
        Alert.alert(
          "로그인 필요",
          "북마크 기능을 사용하려면 로그인이 필요합니다.",
          [
            { text: "취소", style: "cancel" },
            {
              text: "로그인",
              onPress: () => {
                // 로그인 페이지로 이동하는 로직 추가 가능
                console.log("로그인 페이지로 이동");
              },
            },
          ]
        );
      }
      return;
    }

    try {
      setIsLoading(true);
      await toggleBookmarkedWithAPI(exhibitionId);

      const newBookmarkState = !isBookmarked(exhibitionId);
      onBookmarkChange?.(newBookmarkState);

      if (showAlert) {
        Alert.alert(
          newBookmarkState ? "북마크 추가됨" : "북마크 제거됨",
          newBookmarkState
            ? "전시가 찜 목록에 추가되었습니다."
            : "전시가 찜 목록에서 제거되었습니다."
        );
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
      if (showAlert) {
        Alert.alert(
          "오류",
          (error as Error).message ||
            "북마크 처리 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isBookmarkedState = isBookmarked(exhibitionId);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isLoading}
      style={[
        {
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          size='small'
          color={isBookmarkedState ? activeColor : color}
        />
      ) : (
        <Ionicons
          name={isBookmarkedState ? "bookmark" : "bookmark-outline"}
          size={size}
          color={isBookmarkedState ? activeColor : color}
        />
      )}
    </TouchableOpacity>
  );
}
