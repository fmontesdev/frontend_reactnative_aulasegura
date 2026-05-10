import React, { useEffect, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface FadeViewProps {
  children: ReactNode;
  triggerKey?: string | number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeView({ children, triggerKey, duration = 220, style }: FadeViewProps) {
  const opacity = useSharedValue(0.35);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = 0.35;
    translateY.value = 10;
    // Opacidad: de 0.35 => 1, el contenido ya es visible desde el inicio, solo "aclara"
    opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) });
  }, [triggerKey]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animStyle, style]}>
      {children}
    </Animated.View>
  );
}
