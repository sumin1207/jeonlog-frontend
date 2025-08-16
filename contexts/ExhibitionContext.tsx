import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ExhibitionState {
  BookmarkedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
}

interface ExhibitionContextType {
  BookmarkedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
  toggleBookmarked: (exhibitionId: string) => void;
  toggleThumbsUp: (exhibitionId: string) => void;
  toggleVisited: (exhibitionId: string) => void;
  isBookmarked: (exhibitionId: string) => boolean;
  isThumbsUp: (exhibitionId: string) => boolean;
  isVisited: (exhibitionId: string) => boolean;
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
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedState !== null) {
          setState(JSON.parse(storedState));
        }
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
        toggleBookmarked,
        toggleThumbsUp,
        toggleVisited,
        isBookmarked,
        isThumbsUp,
        isVisited,
      }}
    >
      {children}
    </ExhibitionContext.Provider>
  );
};
