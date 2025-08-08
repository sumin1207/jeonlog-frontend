import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

interface ExhibitionLogCardProps {
  record: {
    content: string;
  };
  exhibition: {
    id: string;
    title: string;
    image: any;
  };
}

const ExhibitionLogCard = ({ record, exhibition }: ExhibitionLogCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const styles = StyleSheet.create({
    card: {
      backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#D9D9D9",
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    profileIcon: {
      fontSize: 24,
      color: "#FFFFFF",
    },
    headerText: {
      flex: 1,
    },
    username: {
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : "#000000",
      fontSize: 16,
    },
    timestamp: {
      color: isDark ? "#A9A9A9" : "#666666",
      fontSize: 12,
    },
    exhibitionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    content: {
      fontSize: 14,
      color: isDark ? "#E0E0E0" : "#333333",
      lineHeight: 20,
      marginBottom: 12,
    },
    mainImage: {
      width: "100%",
      height: 300,
      borderRadius: 8,
      marginBottom: 12,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: isDark ? "#333333" : "#EEEEEE",
      paddingTop: 12,
    },
    commentSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    commentAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#D9D9D9",
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    commentText: {
      color: isDark ? "#A9A9A9" : "#666666",
    },
    commentCount: {
      color: isDark ? "#A9A9A9" : "#666666",
      marginTop: 8,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.profileIcon}>프로필</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.username}>임시 닉네임</Text>
          <Text style={styles.timestamp}>20시간 전</Text>
        </View>
      </View>
      <Text style={styles.exhibitionTitle}>{exhibition.title}</Text>
      <Text style={styles.content}>{record.content}</Text>
      {exhibition.image && (
        <Image source={exhibition.image} style={styles.mainImage} />
      )}
      <View style={styles.footer}>
        <Text style={styles.commentCount}>댓글 (999)</Text>
        <View style={styles.commentSection}>
          <View style={styles.commentAvatar}>
            <Text style={styles.profileIcon}>임시 프로필</Text>
          </View>
          <Text style={styles.commentText}>임시 댓글 저도 가보고싶네요~</Text>
        </View>
      </View>
    </View>
  );
};

export default ExhibitionLogCard;
