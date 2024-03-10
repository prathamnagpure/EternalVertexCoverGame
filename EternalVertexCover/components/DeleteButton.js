import React from 'react';
import {Pressable} from 'react-native';
import {DeleteIcon} from './icons';

export default function DeleteButton(handleDeletePress) {
  return (
    <Pressable onPress={handleDeletePress}>
      <DeleteIcon />
    </Pressable>
  );
}
