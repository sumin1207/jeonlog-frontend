import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

interface SkeletonCardProps {
  width?: number | string;
  height?: number;
  style?: any;
}

// 기본 스켈레톤 컴포넌트
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme === "dark" ? "#333" : "#e0e0e0",
          opacity,
        },
        style,
      ]}
    />
  );
};

// 전시 카드 스켈레톤
export const ExhibitionCardSkeleton: React.FC<SkeletonCardProps> = ({
  width = "100%",
  height = 120,
  style,
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.cardSkeleton,
        {
          width,
          height,
          backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
          opacity,
        },
        style,
      ]}>
      <View style={styles.cardContent}>
        {/* 이미지 스켈레톤 */}
        <Skeleton
          width={80}
          height={80}
          borderRadius={8}
          style={styles.imageSkeleton}
        />

        {/* 텍스트 스켈레톤들 */}
        <View style={styles.textContainer}>
          <Skeleton
            width='70%'
            height={18}
            style={styles.titleSkeleton}
          />
          <Skeleton
            width='50%'
            height={14}
            style={styles.subtitleSkeleton}
          />
          <Skeleton
            width='60%'
            height={14}
            style={styles.subtitleSkeleton}
          />
        </View>
      </View>
    </Animated.View>
  );
};

// 검색 결과 스켈레톤
export const SearchResultSkeleton: React.FC = () => {
  return (
    <View style={styles.searchResultContainer}>
      <ExhibitionCardSkeleton style={styles.searchResultItem} />
      <ExhibitionCardSkeleton style={styles.searchResultItem} />
      <ExhibitionCardSkeleton style={styles.searchResultItem} />
      <ExhibitionCardSkeleton style={styles.searchResultItem} />
    </View>
  );
};

// 전시 상세 스켈레톤
export const ExhibitionDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.detailContainer}>
      {/* 포스터 스켈레톤 */}
      <Skeleton
        width='100%'
        height={300}
        borderRadius={12}
        style={styles.posterSkeleton}
      />

      {/* 제목 스켈레톤 */}
      <Skeleton
        width='80%'
        height={24}
        style={styles.titleSkeleton}
      />
      <Skeleton
        width='60%'
        height={16}
        style={styles.subtitleSkeleton}
      />

      {/* 정보 스켈레톤들 */}
      <View style={styles.infoContainer}>
        <Skeleton
          width='100%'
          height={16}
          style={styles.infoSkeleton}
        />
        <Skeleton
          width='90%'
          height={16}
          style={styles.infoSkeleton}
        />
        <Skeleton
          width='95%'
          height={16}
          style={styles.infoSkeleton}
        />
        <Skeleton
          width='85%'
          height={16}
          style={styles.infoSkeleton}
        />
      </View>

      {/* 설명 스켈레톤들 */}
      <View style={styles.descriptionContainer}>
        <Skeleton
          width='100%'
          height={16}
          style={styles.descriptionSkeleton}
        />
        <Skeleton
          width='95%'
          height={16}
          style={styles.descriptionSkeleton}
        />
        <Skeleton
          width='90%'
          height={16}
          style={styles.descriptionSkeleton}
        />
        <Skeleton
          width='85%'
          height={16}
          style={styles.descriptionSkeleton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardSkeleton: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
  },
  imageSkeleton: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  subtitleSkeleton: {
    marginBottom: 4,
  },
  searchResultContainer: {
    paddingHorizontal: 20,
  },
  searchResultItem: {
    marginBottom: 12,
  },
  detailContainer: {
    padding: 20,
  },
  posterSkeleton: {
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoSkeleton: {
    marginBottom: 8,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionSkeleton: {
    marginBottom: 6,
  },
});

export default Skeleton;
