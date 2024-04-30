import React, {useContext} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import images from '../assets/Images';
import {StyleSheet, Image, Pressable} from 'react-native';
import {AnimationSpeedContext} from '../contexts';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Guard({cx, cy, width, height, id, onPress, animateRef}) {
  const leftSV = useSharedValue(cx - width / 2);
  const topSV = useSharedValue(cy - height / 2);
  const {animationSpeed} = useContext(AnimationSpeedContext);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: topSV.value,
      left: leftSV.value,
    };
  });

  function animate(newLeft, newTop, duration) {
    const config = {duration: duration ?? animationSpeed * 300};
    leftSV.value = withTiming(newLeft - width / 2, config);
    topSV.value = withTiming(newTop - height / 2, config);
  }

  animateRef?.(animate);

  const styles = StyleSheet.create({
    image: {
      height: undefined,
      width,
      aspectRatio: 1 / 1.2,
    },
  });

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPressIn={() => {
        onPress?.(id);
      }}>
      <Image source={images.guard} style={styles.image} />
    </AnimatedPressable>
  );
}

export default Guard;
