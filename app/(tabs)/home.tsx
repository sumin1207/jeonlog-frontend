import { StyleSheet, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import HorizontalSliding from "@/components/exhibition/HorizontalSliding";
import RecommendForYou from "@/components/exhibition/RecommendForYou";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import { ExhibitionCardSkeleton } from "@/components/ui/Skeleton";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      setLoading(false);
    };
    loadHomeData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    content: {
      flex: 1,
      paddingTop: 20, // 상단 바와의 간격
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "condensed",
      marginBottom: 20,
      color: theme === "dark" ? "#fff" : "#1c3519",
      textAlign: "left",
      alignSelf: "flex-start",
    },
    skeletonContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    skeletonItem: {
      width: "48%",
      marginBottom: 15,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.content}>
          <Text style={styles.title}>요즘 뜨고 있는 전시</Text>
          <View style={styles.skeletonContainer}>
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>당신을 위한 추천</Text>
          <View style={styles.skeletonContainer}>
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
            <ExhibitionCardSkeleton style={styles.skeletonItem} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.title}>요즘 뜨고 있는 전시</Text>
        <HorizontalSliding />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>당신을 위한 추천</Text>
        <RecommendForYou />
      </View>
    </View>
  );
}
