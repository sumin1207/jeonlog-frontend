import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import LikeButton from "./like/LikeButton";
import CountLike from "./like/countLike";
import { useLikes } from "@/contexts/LikeContext";

interface ExhibitionLogCardProps {
  id: string;
  image: any;
  logTitle: string;
  author: {
    name: string;
    avatar: any;
  };
  timestamp: string;
  likes: number;
  hashtags: string[];
  isInitiallyLiked?: boolean;
}

const ExhibitionLogCard = ({
  id,
  image,
  logTitle,
  author,
  timestamp,
  likes,
  hashtags,
  isInitiallyLiked = false,
}: ExhibitionLogCardProps) => {
  const { userLikes } = useLikes();

  const hasUserInteracted = userLikes[id] !== undefined;
  const isLiked = hasUserInteracted ? userLikes[id]! : isInitiallyLiked;

  let displayLikeCount = likes;
  if (isInitiallyLiked && !isLiked) {
    displayLikeCount = likes - 1;
  } else if (!isInitiallyLiked && isLiked) {
    displayLikeCount = likes + 1;
  }

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.mainImage} />
      <View style={styles.contentContainer}>
        <View style={styles.hashtagsContainer}>
          {hashtags.map((tag, index) => (
            <Text key={index} style={styles.hashtag}>
              #{tag}
            </Text>
          ))}
        </View>
        <View style={styles.authorAndLikesContainer}>
          <View style={styles.authorContainer}>
            <Image source={author.avatar} style={styles.avatar} />
            <View style={styles.authorTextContainer}>
              <Text style={styles.authorName}>{author.name}</Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
          </View>
          <View style={styles.likesContainer}>
            <LikeButton exhibitionLogId={id} size={19} />
            <CountLike count={displayLikeCount} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginBottom: 20,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: 213,
    borderRadius: 8,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
  },
  logTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  authorAndLikesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 16,
    marginRight: 8,
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  authorTextContainer: {
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#7f7f7fff",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  hashtag: {
    fontSize: 12,
    color: "#9e9e9eff",
    marginRight: 8,
    marginBottom: 4,
  },
});

export default ExhibitionLogCard;
