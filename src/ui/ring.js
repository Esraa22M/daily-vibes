import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { COLORS } from '../variables/styles';

const SIZE = 100;
const COLOR = COLORS.activeBackground;

export const Ring = ({ index, animate = true }) => {
  const opacityValue = useSharedValue(0.7);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    if (animate) {
      opacityValue.value = withDelay(
        index * 400,
        withRepeat(withTiming(0, { duration: 2000 }), -1, false)
      );
      scaleValue.value = withDelay(
        index * 400,
        withRepeat(withTiming(3, { duration: 2000 }), -1, false)
      );
    } else {
      cancelAnimation(opacityValue);
      cancelAnimation(scaleValue);
      opacityValue.value = 0.7;
      scaleValue.value = 1;
    }
  }, [index, animate]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
      opacity: opacityValue.value,
    };
  });

  return <Animated.View style={[styles.dot, rStyle]} />;
};

const styles = StyleSheet.create({
  dot: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: COLOR,
    position: 'absolute',
  },
});
