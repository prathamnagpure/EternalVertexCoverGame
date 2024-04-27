import React from 'react';
import {Text} from 'react-native';

export default function SingleLineText({children, ...props}) {
  return (
    <Text adjustsFontSizeToFit={true} numberOfLines={1} {...props}>
      {children}
    </Text>
  );
}
