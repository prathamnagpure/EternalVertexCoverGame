import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Pressable} from 'react-native';
import {SettingsIcon} from './icons';
import {horizontalScale} from '../utils/scaler';

export default function SettingsButton(props) {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Settings');
      }}>
      <SettingsIcon size={horizontalScale(30)} {...props} />
    </Pressable>
  );
}
