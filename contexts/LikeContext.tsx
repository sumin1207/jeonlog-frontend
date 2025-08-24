import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExhibition } from "./ExhibitionContext";

const LIKE_STORAGE_KEY = "exhibition_user_likes";

interface LikesByUser {
  [logId: string]: boolean;
}

interface LikeContextType {
  userLikes: LikesByUser;
  toggleLike: (logId: string) => void;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userLikes, setUserLikes] = useState<LikesByUser>({});
  const { myLogs, toggleLogLikes } = useExhibition(); // Get myLogs and toggleLogLikes

  useEffect(() => {
    const loadLikesFromStorage = async () => {
      try {
        const storedLikes = await AsyncStorage.getItem(LIKE_STORAGE_KEY);
        if (storedLikes) {
          setUserLikes(JSON.parse(storedLikes));
        }
      } catch (e) {
        console.error("Failed to load user likes from storage", e);
      }
    };
    loadLikesFromStorage();
  }, []);

  const toggleLike = (logId: string) => {
    const isCurrentlyLiked = !!userLikes[logId]; // 현재 사용자가 좋아요를 눌렀는지 확인

    // ExhibitionContext에 전달할 액션 결정
    const action = isCurrentlyLiked ? 'decrement' : 'increment';

    // ExhibitionContext에 좋아요 수 변경 요청
    toggleLogLikes(logId, action);

    // 사용자 로컬 좋아요 상태 업데이트 (UI 즉시 반영 및 AsyncStorage 저장)
    setUserLikes((prev) => {
      const newLikes = { ...prev };
      if (isCurrentlyLiked) {
        delete newLikes[logId];
      } else {
        newLikes[logId] = true;
      }
      AsyncStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(newLikes)).catch(
        (e) => console.error("사용자 좋아요 저장 실패", e)
      );
      return newLikes;
    });
  };

  return (
    <LikeContext.Provider value={{ userLikes, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error("useLikes must be used within a LikeProvider");
  }
  return context;
};
