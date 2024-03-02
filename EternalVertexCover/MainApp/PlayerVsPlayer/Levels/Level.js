import {React} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import Stage from '../../../components/Stage';
import stages from '../../../assets/Stages';

export default function Level({route}) {
  const stage = route.params.stage
    ? route.params.stage
    : stages[route.params.levelno];
  const {mode} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Stage stage={stage} mode={mode} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
