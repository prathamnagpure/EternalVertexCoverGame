import React, {useEffect} from 'react';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';
import images from '../assets/Images';
import {StyleSheet, Image} from 'react-native';

export default function Guard({
  top,
  left,
  width,
  height,
  shouldAnimate,
  leftAfterAnimation,
  topAfterAnimation,
}) {
  const leftVal = useSharedValue(left);
  const topVal = useSharedValue(top);

  if (shouldAnimate) {
    const duration = {duration: 5000};
    leftVal.value = withTiming(leftAfterAnimation, duration);
    topVal.value = withTiming(topAfterAnimation, duration);
  } else {
    topVal.value = top;
    leftVal.value = left;
  }
  console.log(topVal.value, leftVal.value, top, left);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',

      top,
      left,
    },
    image: {
      height,
      width,
    },
    animatedContainer: {
      position: 'absolute',
      top: topVal,
      left: leftVal,
    },
  });

  return (
    <Animated.View
      style={shouldAnimate ? styles.animatedContainer : styles.container}>
      <Image source={images.guard} style={styles.image} />
    </Animated.View>
  );
}
