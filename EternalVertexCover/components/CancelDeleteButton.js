import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {LeftArrowIcon} from './icons';

export default function CancelDeleteButton(cancelDelete) {
  return (
    <Pressable style={styles.container} onPress={cancelDelete}>
      <LeftArrowIcon size={23} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});
