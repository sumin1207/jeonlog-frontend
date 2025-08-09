import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
}

const ExhibitionLogCard = ({
  id,
  image,
  logTitle,
  author,
  timestamp,
  likes,
  hashtags,
}: ExhibitionLogCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.mainImage} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.logTitle}>{logTitle}</Text>
        <View style={styles.authorAndLikesContainer}>
          <View style={styles.authorContainer}>
            <Image source={author.avatar} style={styles.avatar} />
            <View style={styles.authorTextContainer}>
              <Text style={styles.authorName}>{author.name}</Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
          </View>
          <View style={styles.likesContainer}>
            <Ionicons name="heart-outline" size={20} color="#666" />
            <Text style={styles.likesCount}>{likes}</Text>
          </View>
        </View>
        <View style={styles.hashtagsContainer}>
          {hashtags.map((tag, index) => (
            <Text key={index} style={styles.hashtag}>
              #{tag}
            </Text>
          ))}
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
  imageContainer: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: 213,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  logTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  authorAndLikesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
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
    color: "#666",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesCount: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hashtag: {
    fontSize: 12,
    color: "#007AFF",
    marginRight: 8,
    marginBottom: 4,
  },
});

export default ExhibitionLogCard;
