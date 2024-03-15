import {React} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {Stage} from '../components';
import stages from '../assets/Stages';

export default function Level({route, navigation}) {
  const stage = route.params.stage
    ? route.params.stage
    : stages[route.params.levelno];
  const {mode} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Stage
        stage={stage}
        navigation={navigation}
        isAttackerTutorial={route.params.isAttackerTutorial}
        isDefenderTutorial={route.params.isDefenderTutorial}
        mode={mode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
