import React, {useContext} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {Stage} from '../components';
import stages from '../assets/Stages';
import {MODES} from '../constants';
import CompletedLevelsContext from '../contexts/CompletedLevelsContext';

export default function Level({route, navigation}) {
  // provide stage for individual levels only
  const {stage, levels, index, mode} = route.params;
  const {completedLevels, updateCompletedLevels} = useContext(
    CompletedLevelsContext,
  );
  const onWin = () => {
    if (mode === MODES.AUTO_ATTACKER) {
      completedLevels.completedDefenderLevels[index] = true;
      updateCompletedLevels({...completedLevels});
    } else if (mode === MODES.AUTO_DEFENDER) {
      completedLevels.completedAttackerLevels[index] = true;
      updateCompletedLevels({...completedLevels});
    }
  };

  let goNextStage = null;
  let correctStage = null;
  const goAgain = () => {
    console.log('go next stage called');
    navigation.goBack();
    navigation.navigate('Level', {
      levels,
      mode,
      index: index,
    });
  };
  if (stage) {
    correctStage = stage;
  } else {
    correctStage = stages[levels[index]];
    if (index + 1 < levels.length) {
      goNextStage = () => {
        console.log('go next stage called');
        navigation.goBack();
        navigation.navigate('Level', {
          levels,
          mode,
          index: index + 1,
        });
      };
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stage
        stage={correctStage}
        navigation={navigation}
        isAttackerTutorial={route.params.isAttackerTutorial}
        isDefenderTutorial={route.params.isDefenderTutorial}
        mode={mode}
        goNextStage={goNextStage}
        goAgain={goAgain}
        onWin={onWin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
