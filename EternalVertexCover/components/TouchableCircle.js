import {Image, StyleSheet, Pressable, View} from 'react-native';
import images from '../assets/Images';
import {React} from 'react';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

function TouchableCircle({
  x,
  y,
  radius,
  showGuard,
  isGuardPresent,
  isSelected,
  id,
  shouldAnimate,
  toX,
  toY,
}) {
  const transX = useSharedValue(0);
  const transY = useSharedValue(0);

  let content = null;

  if (shouldAnimate) {
    const config = {duration: 5000};
    transX.value = withTiming(toX - x, config);
    transY.value = withTiming(toY - y, config);
  }

  const styles = StyleSheet.create({
    circleContainer: {
      position: 'absolute',
      top: y - radius,
      left: x - radius,
      width: 2 * radius,
      height: 2 * radius,
      borderRadius: radius,
      backgroundColor: 'green',
      alignItems: 'center',
      paddingVertical: 5,
      borderColor: isSelected ? 'orange' : 'green',
      borderWidth: 5,
    },
    image: {
      width: radius * 3,
      height: radius * 3,
      resizeMode: 'stretch',
    },
    animated: {
      transform: [{translateX: transX}, {translateY: transY}],
    },
  });

  if (isGuardPresent) {
    content = (
      <Animated.Image
        source={images.guard}
        style={[styles.image, shouldAnimate ? styles.animated : {}]}
      />
    );
  }

  return (
    <Pressable onPressIn={() => showGuard(id)}>
      <View style={styles.circleContainer}>{content}</View>
    </Pressable>
  );
}

export default TouchableCircle;
