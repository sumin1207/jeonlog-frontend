import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bookmarkService } from "../services/bookmarkService";
import { useAuth } from "../components/context/AuthContext";

interface ExhibitionState {
  BookmarkedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
  myLogs: any[]; // State for authored logs
  myDrafts: { [key: string]: any }; // State for drafts
}

interface ExhibitionContextType {
  BookmarkedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
  myLogs: any[]; // State for authored logs
  myDrafts: { [key: string]: any };
  toggleBookmarked: (exhibitionId: string) => void;
  toggleBookmarkedWithAPI: (exhibitionId: string) => Promise<void>; // API 연동된 북마크 토글
  loadBookmarksFromAPI: () => Promise<void>; // API에서 북마크 목록 로드
  toggleThumbsUp: (exhibitionId: string) => void;
  toggleVisited: (exhibitionId: string) => void;
  markAsVisited: (exhibitionId: string) => void;
  addMyLog: (exhibitionId: string, logData: any) => Promise<void>; // Function to add a new log
  deleteMyLog: (exhibitionId: string) => Promise<void>; // Function to delete a log
  saveDraft: (exhibitionId: string, draftData: any) => Promise<void>;
  deleteDraft: (exhibitionId: string) => Promise<void>;
  toggleLogLikes: (
    exhibitionId: string,
    action: "increment" | "decrement"
  ) => void;
  isBookmarked: (exhibitionId: string) => boolean;
  isThumbsUp: (exhibitionId: string) => boolean;
  isVisited: (exhibitionId: string) => boolean;
  isLoading: boolean;
}

const ExhibitionContext = createContext<ExhibitionContextType | undefined>(
  undefined
);

export const useExhibition = () => {
  const context = useContext(ExhibitionContext);
  if (context === undefined) {
    throw new Error("useExhibition must be used within an ExhibitionProvider");
  }
  return context;
};

interface ExhibitionProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "exhibitionState";
const DRAFTS_STORAGE_KEY = "exhibition_drafts";

export const ExhibitionProvider: React.FC<ExhibitionProviderProps> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();
  const [state, setState] = useState<ExhibitionState>({
    BookmarkedExhibitions: [],
    thumbsUpExhibitions: [],
    visitedExhibitions: [],
    myLogs: [],
    myDrafts: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(STORAGE_KEY);
        const storedLogs = await AsyncStorage.getItem("exhibition_records");
        const storedDrafts = await AsyncStorage.getItem(DRAFTS_STORAGE_KEY);

        const exhibitionState: ExhibitionState = storedState
          ? JSON.parse(storedState)
          : {
              BookmarkedExhibitions: [],
              thumbsUpExhibitions: [],
              visitedExhibitions: [],
              myLogs: [],
              myDrafts: {},
            };
        const initialLogs = storedLogs ? JSON.parse(storedLogs) : {};
        const initialDrafts = storedDrafts ? JSON.parse(storedDrafts) : {};

        // Filter logs to only include those whose ID is in the visitedExhibitions list
        const validLogIds = Object.keys(initialLogs).filter((id) =>
          exhibitionState.visitedExhibitions.includes(id)
        );

        const transformedLogs = validLogIds.map((exhibitionId) => ({
          id: exhibitionId,
          ...initialLogs[exhibitionId],
        }));

        setState({
          ...exhibitionState,
          myLogs: transformedLogs.reverse(),
          myDrafts: initialDrafts,
        });
      } catch (error) {
        console.error("Failed to load exhibition state from storage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveState = async () => {
        try {
          // Separate drafts from the main state before saving to avoid duplication
          const { myDrafts, ...stateToSave } = state;
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
          await AsyncStorage.setItem(
            DRAFTS_STORAGE_KEY,
            JSON.stringify(myDrafts)
          );
        } catch (error) {
          console.error("Failed to save exhibition state to storage", error);
        }
      };
      saveState();
    }
  }, [state, isLoading]);

  const saveDraft = async (exhibitionId: string, draftData: any) => {
    setState((prev) => {
      const newDrafts = { ...prev.myDrafts, [exhibitionId]: draftData };
      return { ...prev, myDrafts: newDrafts };
    });
    // No need to call AsyncStorage here, the useEffect will handle it.
  };

  const deleteDraft = async (exhibitionId: string) => {
    setState((prev) => {
      const newDrafts = { ...prev.myDrafts };
      delete newDrafts[exhibitionId];
      return { ...prev, myDrafts: newDrafts };
    });
    // No need to call AsyncStorage here, the useEffect will handle it.
  };

  const toggleBookmarked = (exhibitionId: string) => {
    setState((prev) => ({
      ...prev,
      BookmarkedExhibitions: prev.BookmarkedExhibitions.includes(exhibitionId)
        ? prev.BookmarkedExhibitions.filter((id) => id !== exhibitionId)
        : [...prev.BookmarkedExhibitions, exhibitionId],
    }));
  };

  // API 연동된 북마크 토글 함수
  const toggleBookmarkedWithAPI = async (exhibitionId: string) => {
    if (!isLoggedIn) {
      throw new Error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }

    try {
      const isCurrentlyBookmarked =
        state.BookmarkedExhibitions.includes(exhibitionId);

      if (isCurrentlyBookmarked) {
        // 북마크 제거
        await bookmarkService.removeBookmark(parseInt(exhibitionId));
        setState((prev) => ({
          ...prev,
          BookmarkedExhibitions: prev.BookmarkedExhibitions.filter(
            (id) => id !== exhibitionId
          ),
        }));
      } else {
        // 북마크 추가
        await bookmarkService.addBookmark(parseInt(exhibitionId));
        setState((prev) => ({
          ...prev,
          BookmarkedExhibitions: [...prev.BookmarkedExhibitions, exhibitionId],
        }));
      }
    } catch (error) {
      console.error("북마크 토글 에러:", error);
      // 에러 발생 시 사용자에게 알림 (토스트 메시지 등)
      throw error;
    }
  };

  // API에서 북마크 목록 로드
  const loadBookmarksFromAPI = async () => {
    console.log("🔄 북마크 목록 로드 시작");
    console.log("🔐 로그인 상태:", isLoggedIn);

    if (!isLoggedIn) {
      console.log("❌ 로그인되지 않아 북마크 목록을 로드할 수 없습니다.");
      return;
    }

    try {
      console.log("📡 bookmarkService.getBookmarks() 호출 중...");
      const bookmarks = await bookmarkService.getBookmarks();
      console.log("📊 API 응답 데이터:", bookmarks);
      console.log("📊 API 응답 타입:", typeof bookmarks);
      console.log("📊 API 응답이 배열인가:", Array.isArray(bookmarks));

      // API 응답에서 전시 ID 배열 추출 (API 응답 구조에 따라 조정 필요)
      const bookmarkIds = bookmarks.map((bookmark: any) => {
        const id = bookmark.exhibitionId?.toString() || bookmark.id?.toString();
        console.log("🔍 북마크 ID 추출:", bookmark, "->", id);
        return id;
      });

      console.log("📋 추출된 북마크 ID 목록:", bookmarkIds);

      setState((prev) => ({
        ...prev,
        BookmarkedExhibitions: bookmarkIds,
      }));

      console.log("✅ 북마크 목록 상태 업데이트 완료");
    } catch (error) {
      console.error("❌ 북마크 목록 로드 에러:", error);
      console.error(
        "❌ 에러 상세:",
        error instanceof Error ? error.message : String(error)
      );
      // 에러 발생 시 기존 로컬 상태 유지
    }
  };

  const toggleThumbsUp = (exhibitionId: string) => {
    setState((prev) => ({
      ...prev,
      thumbsUpExhibitions: prev.thumbsUpExhibitions.includes(exhibitionId)
        ? prev.thumbsUpExhibitions.filter((id) => id !== exhibitionId)
        : [...prev.thumbsUpExhibitions, exhibitionId],
    }));
  };

  const toggleVisited = (exhibitionId: string) => {
    setState((prev) => ({
      ...prev,
      visitedExhibitions: prev.visitedExhibitions.includes(exhibitionId)
        ? prev.visitedExhibitions.filter((id) => id !== exhibitionId)
        : [...prev.visitedExhibitions, exhibitionId],
    }));
  };

  const markAsVisited = (exhibitionId: string) => {
    setState((prev) => {
      if (prev.visitedExhibitions.includes(exhibitionId)) {
        return prev; // Already visited, do nothing.
      }
      return {
        ...prev,
        visitedExhibitions: [...prev.visitedExhibitions, exhibitionId],
      };
    });
  };

  const addMyLog = async (exhibitionId: string, logData: any) => {
    const newLog = {
      id: exhibitionId,
      ...logData,
    };
    // Update state first for immediate UI response
    setState((prev) => {
      // Filter out the old log if it exists, to prevent duplicates
      const otherLogs = prev.myLogs.filter((log) => log.id !== exhibitionId);
      const newDrafts = { ...prev.myDrafts };
      delete newDrafts[exhibitionId]; // Delete draft on final save

      return {
        ...prev,
        // Add the new or updated log to the front of the list
        myLogs: [newLog, ...otherLogs],
        myDrafts: newDrafts,
      };
    });
    // Then, update AsyncStorage
    try {
      const savedRecordsJSON = await AsyncStorage.getItem("exhibition_records");
      const records = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};
      records[exhibitionId] = logData;
      await AsyncStorage.setItem("exhibition_records", JSON.stringify(records));
    } catch (e) {
      console.error("Failed to save new log to AsyncStorage", e);
      // Optionally revert state if async storage fails
    }
  };

  const deleteMyLog = async (exhibitionId: string) => {
    setState((prev) => {
      const newVisitedExhibitions = prev.visitedExhibitions.filter(
        (id) => id !== exhibitionId
      );
      const newMyLogs = prev.myLogs.filter((log) => log.id !== exhibitionId);
      return {
        ...prev,
        visitedExhibitions: newVisitedExhibitions,
        myLogs: newMyLogs,
      };
    });

    try {
      const savedRecordsJSON = await AsyncStorage.getItem("exhibition_records");
      const records = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};
      delete records[exhibitionId];
      await AsyncStorage.setItem("exhibition_records", JSON.stringify(records));
    } catch (e) {
      console.error("Failed to delete log from AsyncStorage", e);
    }
  };

  const toggleLogLikes = (
    exhibitionId: string,
    action: "increment" | "decrement"
  ) => {
    setState((prev) => {
      let calculatedLikesForStorage = 0; // AsyncStorage에 저장할 값을 캡처하기 위한 변수

      const updatedMyLogs = prev.myLogs.map((log) => {
        if (log.id === exhibitionId) {
          const currentLikes = log.likes || 0;
          let newLikes =
            action === "increment" ? currentLikes + 1 : currentLikes - 1;
          if (newLikes < 0) newLikes = 0; // 좋아요는 0 미만이 될 수 없음
          calculatedLikesForStorage = newLikes; // 계산된 값을 캡처
          return { ...log, likes: newLikes };
        }
        return log;
      });

      // AsyncStorage 업데이트 로직을 setState 콜백 내에서 실행
      // 이렇게 하면 calculatedLikesForStorage 값이 정확히 캡처됩니다.
      AsyncStorage.getItem("exhibition_records")
        .then((json) => {
          const records = json ? JSON.parse(json) : {};
          if (records[exhibitionId]) {
            records[exhibitionId].likes = calculatedLikesForStorage; // 캡처된 값을 사용
            AsyncStorage.setItem("exhibition_records", JSON.stringify(records));
          }
        })
        .catch((e) =>
          console.error("Failed to update log likes in AsyncStorage", e)
        );

      return { ...prev, myLogs: updatedMyLogs };
    });
  };

  const isBookmarked = (exhibitionId: string) => {
    return state.BookmarkedExhibitions.includes(exhibitionId);
  };

  const isThumbsUp = (exhibitionId: string) => {
    return state.thumbsUpExhibitions.includes(exhibitionId);
  };

  const isVisited = (exhibitionId: string) => {
    return state.visitedExhibitions.includes(exhibitionId);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ExhibitionContext.Provider
      value={{
        BookmarkedExhibitions: state.BookmarkedExhibitions,
        thumbsUpExhibitions: state.thumbsUpExhibitions,
        visitedExhibitions: state.visitedExhibitions,
        myLogs: state.myLogs,
        myDrafts: state.myDrafts,
        toggleBookmarked,
        toggleBookmarkedWithAPI,
        loadBookmarksFromAPI,
        toggleThumbsUp,
        toggleVisited,
        markAsVisited,
        addMyLog,
        deleteMyLog,
        saveDraft,
        deleteDraft,
        toggleLogLikes,
        isBookmarked,
        isThumbsUp,
        isVisited,
        isLoading,
      }}>
      {children}
    </ExhibitionContext.Provider>
  );
};
