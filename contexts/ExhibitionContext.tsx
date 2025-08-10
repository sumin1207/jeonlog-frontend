import React, { createContext, useContext, useState, ReactNode } from "react";

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

export const ExhibitionProvider: React.FC<ExhibitionProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<ExhibitionState>({
    BookmarkedExhibitions: [],
    thumbsUpExhibitions: [],
    visitedExhibitions: [],
  });

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
