import React from 'react';
import {Pressable} from 'react-native';
import LeftArrowIcon from './icons/LeftArrowIcon';

export default function CancelDeleteButton(cancelDelete) {
  return (
    <Pressable style={{padding: 5}} onPress={cancelDelete}>
      <LeftArrowIcon size={23} />
    </Pressable>
  );
}
