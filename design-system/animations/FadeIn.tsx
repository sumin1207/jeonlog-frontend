import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle, View } from "react-native";

export interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 300,
  delay = 0,
  style,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });

    animation.start(onAnimationComplete);

    return () => animation.stop();
  }, [fadeAnim, duration, delay, onAnimationComplete]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
};
