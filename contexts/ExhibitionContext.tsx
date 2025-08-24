import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ExhibitionState {
  BookmarkedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
  myLogs: any[]; // State for authored logs
}

interface ExhibitionContextType {
  BookmarkedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
  myLogs: any[]; // State for authored logs
  toggleBookmarked: (exhibitionId: string) => void;
  toggleThumbsUp: (exhibitionId: string) => void;
  toggleVisited: (exhibitionId: string) => void;
  markAsVisited: (exhibitionId: string) => void;
  addMyLog: (exhibitionId: string, logData: any) => Promise<void>; // Function to add a new log
  deleteMyLog: (exhibitionId: string) => Promise<void>; // Function to delete a log
  toggleLogLikes: (exhibitionId: string, action: 'increment' | 'decrement') => void;
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

export const ExhibitionProvider: React.FC<ExhibitionProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<ExhibitionState>({
    BookmarkedExhibitions: [],
    thumbsUpExhibitions: [],
    visitedExhibitions: [],
    myLogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(STORAGE_KEY);
        const storedLogs = await AsyncStorage.getItem("exhibition_records");

        const exhibitionState: ExhibitionState = storedState
          ? JSON.parse(storedState)
          : {
              BookmarkedExhibitions: [],
              thumbsUpExhibitions: [],
              visitedExhibitions: [],
              myLogs: [],
            };
        const initialLogs = storedLogs ? JSON.parse(storedLogs) : {};

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
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          console.error("Failed to save exhibition state to storage", error);
        }
      };
      saveState();
    }
  }, [state, isLoading]);

  const toggleBookmarked = (exhibitionId: string) => {
    setState((prev) => ({
      ...prev,
      BookmarkedExhibitions: prev.BookmarkedExhibitions.includes(exhibitionId)
        ? prev.BookmarkedExhibitions.filter((id) => id !== exhibitionId)
        : [...prev.BookmarkedExhibitions, exhibitionId],
    }));
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
      return {
        ...prev,
        // Add the new or updated log to the front of the list
        myLogs: [newLog, ...otherLogs],
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

  const toggleLogLikes = (exhibitionId: string, action: 'increment' | 'decrement') => {
    setState((prev) => {
      let calculatedLikesForStorage = 0; // AsyncStorage에 저장할 값을 캡처하기 위한 변수

      const updatedMyLogs = prev.myLogs.map((log) => {
        if (log.id === exhibitionId) {
          const currentLikes = log.likes || 0;
          let newLikes = action === 'increment' ? currentLikes + 1 : currentLikes - 1;
          if (newLikes < 0) newLikes = 0; // 좋아요는 0 미만이 될 수 없음
          calculatedLikesForStorage = newLikes; // 계산된 값을 캡처
          return { ...log, likes: newLikes };
        }
        return log;
      });

      // AsyncStorage 업데이트 로직을 setState 콜백 내에서 실행
      // 이렇게 하면 calculatedLikesForStorage 값이 정확히 캡처됩니다.
      AsyncStorage.getItem("exhibition_records").then(json => {
        const records = json ? JSON.parse(json) : {};
        if (records[exhibitionId]) {
          records[exhibitionId].likes = calculatedLikesForStorage; // 캡처된 값을 사용
          AsyncStorage.setItem("exhibition_records", JSON.stringify(records));
        }
      }).catch(e => console.error("Failed to update log likes in AsyncStorage", e));

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
        toggleBookmarked,
        toggleThumbsUp,
        toggleVisited,
        markAsVisited,
        addMyLog,
        deleteMyLog,
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
