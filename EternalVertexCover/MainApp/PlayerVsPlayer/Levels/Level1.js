import {React, Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import Stage from '../../../components/Stage';
import stages from '../../../assets/Stages';
const pvplevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default function Level1({route}) {
  const stage = route.params.stage
    ? route.params.stage
    : stages[pvplevels[route.params.levelno]];
  return (
    <SafeAreaView style={styles.container}>
      <Stage stage={stage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
