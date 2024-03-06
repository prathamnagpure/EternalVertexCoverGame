import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import images from '../assets/Images';
import {StyleSheet, Image, Pressable} from 'react-native';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Guard({top, left, width, height, id, onPress, animateRef}) {
  const leftSV = useSharedValue(left - width / 2);
  const topSV = useSharedValue(top - height / 2);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: topSV.value,
      left: leftSV.value,
    };
  });

  function animate(newLeft, newTop) {
    console.log({left, newLeft, top, newTop});
    const config = {duration: 5000};
    leftSV.value = withTiming(newLeft - width / 2, config);
    topSV.value = withTiming(newTop - height / 2, config);
  }

  if (animateRef) {
    animateRef(animate);
  }

  const styles = StyleSheet.create({
    image: {
      height,
      width,
      flex: 1,
    },
  });

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPressIn={() => {
        if (onPress) {
          onPress(id);
        }
      }}>
      <Image source={images.guard} style={styles.image} />
    </AnimatedPressable>
  );
}

export default Guard;
