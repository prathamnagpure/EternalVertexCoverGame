import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';

export default function RadioButton({selected, style, onPress, id}) {
  return (
    <Pressable
      style={[styles.pressable, style]}
      onPressIn={() => onPress?.(id)}>
      {selected ? <View style={styles.view} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
});
