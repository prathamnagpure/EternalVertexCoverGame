import {StyleSheet, Pressable, View} from 'react-native';
import {React} from 'react';

function TouchableCircle({cx, cy, r, onPress, isSelected, id, disabled}) {
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
      <View
        style={[staticStyle.circleContainer, dynamicStyle.circleContainer]}
      />
    </Pressable>
  );
}

const staticStyle = StyleSheet.create({
  circleContainer: {
    position: 'absolute',
    backgroundColor: 'green',
    borderWidth: 5,
  },
});

export default TouchableCircle;
