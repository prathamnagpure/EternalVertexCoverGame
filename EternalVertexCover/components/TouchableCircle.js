import {Image, StyleSheet, Pressable, View} from 'react-native';
import images from '../assets/Images';
import {React, memo} from 'react';

const TouchableCircle = memo(function TouchableCircle({
  x,
  y,
  radius,
  showGuard,
  isGuardPresent,
  isSelected,
  id,
}) {
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
  });

  let content = null;

  if (isGuardPresent) {
    content = <Image source={images.guard} style={styles.image} />;
  }

  return (
    <Pressable onPressIn={() => showGuard(id)}>
      <View style={styles.circleContainer}>{content}</View>
    </Pressable>
  );
});

export default TouchableCircle;
