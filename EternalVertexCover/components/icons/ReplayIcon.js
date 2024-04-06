import React from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {horizontalScale} from '../../utils/scaler';

export default function ReplayIcon(props) {
  return (
    <Icon name="refresh" color="#000" size={horizontalScale(30)} {...props} />
  );
}
