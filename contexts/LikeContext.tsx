import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      if (newLikes[logId]) {
        delete newLikes[logId];
      } else {
        newLikes[logId] = true;
      }
      AsyncStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(newLikes)).catch(e => console.error("Failed to save user likes", e));
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
