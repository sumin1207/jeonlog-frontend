import React, { createContext, useContext, useState, ReactNode } from "react";

interface ExhibitionState {
  likedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
}

interface ExhibitionContextType {
  likedExhibitions: string[];
  thumbsUpExhibitions: string[];
  visitedExhibitions: string[];
  toggleLiked: (exhibitionId: string) => void;
  toggleThumbsUp: (exhibitionId: string) => void;
  toggleVisited: (exhibitionId: string) => void;
  isLiked: (exhibitionId: string) => boolean;
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
    likedExhibitions: [],
    thumbsUpExhibitions: [],
    visitedExhibitions: [],
  });

  const toggleLiked = (exhibitionId: string) => {
    setState((prev) => ({
      ...prev,
      likedExhibitions: prev.likedExhibitions.includes(exhibitionId)
        ? prev.likedExhibitions.filter((id) => id !== exhibitionId)
        : [...prev.likedExhibitions, exhibitionId],
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

  const isLiked = (exhibitionId: string) => {
    return state.likedExhibitions.includes(exhibitionId);
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
        likedExhibitions: state.likedExhibitions,
        thumbsUpExhibitions: state.thumbsUpExhibitions,
        visitedExhibitions: state.visitedExhibitions,
        toggleLiked,
        toggleThumbsUp,
        toggleVisited,
        isLiked,
        isThumbsUp,
        isVisited,
      }}>
      {children}
    </ExhibitionContext.Provider>
  );
};
