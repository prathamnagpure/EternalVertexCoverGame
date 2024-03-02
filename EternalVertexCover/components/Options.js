import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-svg';

export default function Options() {
  return (
    <View style={styles}>
      <Text>Testing Modal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
  },
});
