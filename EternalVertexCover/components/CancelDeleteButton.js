import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {CloseIcon} from './icons';

export default function CancelDeleteButton(cancelDelete) {
  return (
    <Pressable style={styles.container} onPress={cancelDelete}>
      <CloseIcon size={23} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});
