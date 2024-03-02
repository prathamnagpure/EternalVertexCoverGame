import Images from '../assets/Images';
import React, {useEffect} from 'react';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
export default function Poop({poopX, poopY, animatedStylesPoop}) {
  console.log('poopppp');
  console.log('inside poop ', poopX.value, poopY.value);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: poopX.value,
      top: poopY.value,
    };
  });

  return (
    <Animated.Image
      source={Images.poop}
      style={[
        {
          width: 70,
          height: 70,
          position: 'absolute',
          left: poopX,
          top: poopY,
          // borderWidth: 20,
          // borderColor: 'blue',
          // transform: [{rotate: `${Math.atan(angle)}deg`}],
        },
        animatedStyle,
        animatedStylesPoop,
      ]}
    />
  );
}
