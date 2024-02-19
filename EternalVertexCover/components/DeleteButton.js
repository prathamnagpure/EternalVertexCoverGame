import React from 'react';
import {Pressable, View} from 'react-native';
import DeleteIcon from './icons/DeleteIcon';

export default function DeleteButton(handleDeletePress) {
  return (
    <Pressable onPress={handleDeletePress}>
      <DeleteIcon />
    </Pressable>
  );
}
