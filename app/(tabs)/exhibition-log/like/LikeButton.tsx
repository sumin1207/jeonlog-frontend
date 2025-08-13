
import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLikes } from '@/contexts/LikeContext';

interface LikeButtonProps {
  exhibitionLogId: any;
}

const LikeButton: React.FC<LikeButtonProps> = ({ exhibitionLogId }) => {
  const { userLikes, toggleLike } = useLikes();
  const isLiked = userLikes[exhibitionLogId] || false;

  const handlePress = () => {
    toggleLike((exhibitionLogId));
  };

  return (
    <Pressable onPress={handlePress}>
      <Ionicons
        name={isLiked ? 'heart' : 'heart-outline'}
        size={24}
        color={isLiked ? 'red' : 'black'}
      />
    </Pressable>
  );
};

export default LikeButton;
