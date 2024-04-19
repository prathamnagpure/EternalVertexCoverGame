import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import {Stage} from '../components';
import stages from '../assets/Stages';
import {MODES} from '../constants';
import CompletedLevelsContext from '../contexts/CompletedLevelsContext';
import LevelHeader from '../components/LevelHeader';
import {horizontalScale, guidelineBaseHeight} from '../utils/scaler';

export default function Level({route, navigation}) {
  const [isRestartModalVisible, setRestartModalVisible] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return LevelHeader({params: route.params, setRestartModalVisible});
      },
    });
  }, [navigation, route.params]);

  const {stage, levels, index, mode, isAttackerTutorial, isDefenderTutorial} =
    route.params;
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
      ...route.params,
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
        isAttackerTutorial={isAttackerTutorial}
        isDefenderTutorial={isDefenderTutorial}
        mode={mode}
        goNextStage={goNextStage}
        goAgain={goAgain}
        onWin={onWin}
      />
      <Modal
        visible={isRestartModalVisible}
        transparent={true}
        onRequestClose={() => setRestartModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.text}>Restart Game?</Text>
            <View style={styles.buttonContainer}>
              <Pressable
                onPressIn={goAgain}
                style={[styles.yesButton, styles.button]}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
              <Pressable
                onPressIn={() => setRestartModalVisible(false)}
                style={[styles.noButton, styles.button]}>
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: horizontalScale(10),
    borderRadius: horizontalScale(10),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: horizontalScale(10),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: horizontalScale(20),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: horizontalScale(16),
    alignSelf: 'center',
  },
  button: {
    padding: horizontalScale(5),
    borderRadius: horizontalScale(10),
    width: horizontalScale(60),
  },
  yesButton: {
    backgroundColor: 'red',
  },
  noButton: {
    backgroundColor: 'blue',
  },
});
