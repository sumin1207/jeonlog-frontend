import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExhibition } from './ExhibitionContext';

const LIKE_STORAGE_KEY = 'exhibition_user_likes';

interface LikesByUser {
  [logId: string]: boolean; 
}

interface LikeContextType {
  userLikes: LikesByUser;
  toggleLike: (logId: string) => void;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLikes, setUserLikes] = useState<LikesByUser>({});
  const { myLogs, updateLogLikes } = useExhibition(); // Get myLogs and updateLogLikes

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
    setUserLikes(prev => {
      const newLikes = { ...prev };
      const isCurrentlyLiked = newLikes[logId];
      let newLikesCount;

      if (isCurrentlyLiked) {
        delete newLikes[logId];
        newLikesCount = (myLogs.find(log => log.id === logId)?.likes || 1) - 1; // Decrement
      } else {
        newLikes[logId] = true;
        newLikesCount = (myLogs.find(log => log.id === logId)?.likes || 0) + 1; // Increment
      }

      AsyncStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(newLikes)).catch(e => console.error("Failed to save user likes", e));

      // Update the likes count in ExhibitionContext
      updateLogLikes(logId, newLikesCount);

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
    throw new Error('useLikes must be used within a LikeProvider');
  }
  return context;
};
