import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

export interface ScaleInProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  scale = 0.8,
  duration = 300,
  delay = 0,
  style,
  onAnimationComplete,
}) => {
  const scaleAnim = useRef(new Animated.Value(scale)).current;

  useEffect(() => {
    const animation = Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });

    animation.start(onAnimationComplete);

    return () => animation.stop();
  }, [scaleAnim, scale, duration, delay, onAnimationComplete]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
};
