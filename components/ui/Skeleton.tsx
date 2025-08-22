import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { createSkeletonStyles } from "../../design-system/styles/SkeletonStyles";

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
  const styles = createSkeletonStyles(theme);
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
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
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
  const styles = createSkeletonStyles(theme);
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
        styles.exhibitionCard,
        {
          width,
          height,
          opacity,
        },
        style,
      ]}>
      <View style={{ flexDirection: "row" }}>
        <Animated.View style={[styles.imagePlaceholder, { opacity }]} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Animated.View style={[styles.titleSkeleton, { opacity }]} />
          <Animated.View style={[styles.subtitleSkeleton, { opacity }]} />
          <Animated.View style={[styles.smallTextSkeleton, { opacity }]} />
        </View>
      </View>
    </Animated.View>
  );
};

// 검색 결과 스켈레톤
export const SearchResultSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const styles = createSkeletonStyles(theme);

  return (
    <View style={{ paddingHorizontal: 20 }}>
      {[1, 2, 3].map((index) => (
        <View
          key={index}
          style={{ marginBottom: 12 }}>
          <ExhibitionCardSkeleton height={100} />
        </View>
      ))}
    </View>
  );
};

// 전시 상세 스켈레톤
export const ExhibitionDetailSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const styles = createSkeletonStyles(theme);

  return (
    <View style={{ padding: 20 }}>
      {/* 포스터 스켈레톤 */}
      <Animated.View
        style={[
          styles.skeleton,
          {
            width: "100%",
            height: 400,
            borderRadius: 8,
            marginBottom: 20,
          },
        ]}
      />

      {/* 제목 스켈레톤 */}
      <View style={{ marginBottom: 20 }}>
        <Animated.View style={[styles.titleSkeleton, { opacity: 0.7 }]} />
        <Animated.View style={[styles.subtitleSkeleton, { opacity: 0.7 }]} />
      </View>

      {/* 정보 스켈레톤 */}
      <View style={{ marginTop: 20 }}>
        {[1, 2, 3, 4].map((index) => (
          <Animated.View
            key={index}
            style={[styles.textSkeleton, { opacity: 0.7, marginBottom: 8 }]}
          />
        ))}
      </View>

      {/* 설명 스켈레톤 */}
      <View style={{ marginTop: 20 }}>
        {[1, 2, 3, 4].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.descriptionSkeleton,
              { opacity: 0.7, marginBottom: 6 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Skeleton;
