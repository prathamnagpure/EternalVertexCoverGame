import React from 'react';
import Slider from '@react-native-community/slider';
import {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  BackgroundMusicVolumeContext,
  AnimationSpeedContext,
  InGameVolumeContext,
} from '../contexts';
import {horizontalScale} from '../utils/scaler';
import {setData} from '../utils/storage';

export default function Settings() {
  const {inGameVolume, setInGameVolume} = useContext(InGameVolumeContext);
  const {backgroundMusicVolume, changeVolume} = useContext(
    BackgroundMusicVolumeContext,
  );
  const {animationSpeed, setAnimationSpeed} = useContext(AnimationSpeedContext);

  function handleBackgroundMusicVolumeChanged(volume) {
    changeVolume(volume / 10);
    setData('backgroundMusicVolume', volume / 10);
  }

  function handleInGameMusicVolumeChanged(volume) {
    setInGameVolume(volume / 10);
    setData('inGameVolume', volume / 10);
  }

  function handleAnimationSpeedChanged(speed) {
    setAnimationSpeed(speed);
    setData('animationSpeed', speed);
  }
  console.log({inGameVolume, backgroundMusicVolume, animationSpeed});

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {top: '10%'},
        ]}>{`Animation Duration: ${animationSpeed}`}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        style={[styles.slider, {top: '10%'}]}
        value={animationSpeed}
        onValueChange={handleAnimationSpeedChanged}
      />
      <Text style={[styles.text, {top: '20%'}]}>
        {`Background Music Volume: ${backgroundMusicVolume * 10}`}
      </Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        style={[styles.slider, {top: '20%'}]}
        value={backgroundMusicVolume * 10}
        step={1}
        onValueChange={handleBackgroundMusicVolumeChanged}
      />
      <Text style={[styles.text, {top: '30%'}]}>{`In-Game Sound Volume: ${
        inGameVolume * 10
      }`}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        style={[styles.slider, {top: '30%'}]}
        value={inGameVolume * 10}
        onValueChange={handleInGameMusicVolumeChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#999',
  },
  slider: {
    top: '50%',
    margin: '2%',
  },
  text: {
    color: 'black',
    margin: '2%',
    fontSize: horizontalScale(16),
  },
});
