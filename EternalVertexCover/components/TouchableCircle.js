import {StyleSheet, Pressable, View, Text, Image} from 'react-native';
import {React} from 'react';
import images from '../assets/Images';

function TouchableCircle({
  cx,
  cy,
  r,
  onPress,
  isSelected,
  id,
  disabled,
  isGuard,
}) {
  const dynamicStyle = StyleSheet.create({
    circleContainer: {
      top: cy - r,
      left: cx - r,
      width: 2 * r,
      height: 2 * r,
      borderRadius: r,
      borderColor: isSelected ? 'orange' : 'darkgreen',
    },
  });

  return (
    <Pressable onPressIn={() => onPress?.(id)} disabled={disabled}>
      <View style={[staticStyle.circleContainer, dynamicStyle.circleContainer]}>
        {isGuard && (
          <Image
            source={images.guard}
            style={{
              position: 'absolute',
              height: 3 * r,
              width: undefined,
              aspectRatio: 1 / 1.2,
            }}
          />
        )}
      </View>
    </Pressable>
  );
}

const staticStyle = StyleSheet.create({
  circleContainer: {
    position: 'absolute',
    backgroundColor: 'green',
    borderWidth: 5,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default TouchableCircle;
