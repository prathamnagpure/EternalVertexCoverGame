import Images from '../assets/Images';
import React from 'react';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {horizontalScale} from '../utils/scaler';
export default function Poop({poopX, poopY, animatedStylesPoop}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: poopX.value,
      top: poopY.value,
    };
  });

  return (
    <Animated.Image
      pointerEvents="none"
      source={Images.poop}
      style={[
        styles.image,
        {
          left: poopX,
          top: poopY,
        },
        animatedStyle,
        animatedStylesPoop,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: horizontalScale(70),
    height: horizontalScale(70),
  },
});
