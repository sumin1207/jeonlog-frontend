import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

export interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "up",
  distance = 50,
  duration = 300,
  delay = 0,
  style,
  onAnimationComplete,
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const animation = Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver: true,
    });

    animation.start(onAnimationComplete);

    return () => animation.stop();
  }, [slideAnim, distance, duration, delay, onAnimationComplete]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return { translateY: slideAnim };
      case "down":
        return {
          translateY: slideAnim.interpolate({
            inputRange: [0, distance],
            outputRange: [0, -distance],
          }),
        };
      case "left":
        return { translateX: slideAnim };
      case "right":
        return {
          translateX: slideAnim.interpolate({
            inputRange: [0, distance],
            outputRange: [0, -distance],
          }),
        };
      default:
        return { translateY: slideAnim };
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [getTransform()],
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
};
