import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Sound from 'react-native-sound';
import MainNavigator from './navigation/MainNavigator';

export default function App() {
  const toPlay = useRef({val: 0});
  if (toPlay.current.val === 0) {
    const mainBGM = new Sound('mainBGM.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('error in creating mainBGM', error);
        return;
      }
      console.log('sound successfully created ');
      while (mainBGM.isLoaded() === false) {}
      mainBGM.setNumberOfLoops(-1);
      mainBGM.setVolume(0.4);
      // if (toPlay === 0) {
      mainBGM.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      toPlay.current.val = 1;
      console.log(' app.jsx was the sound file loaded ', mainBGM.isLoaded());
    });
  }

  var fdata = require('./assets/graphMaps/file3.json');
  console.log(fdata['1,2,4;6']);
  var mp = new Map(Object.entries(fdata));
  console.log(mp.get('1,2,4;6')[0]);
  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <NavigationContainer independent={true}>
      <MainNavigator />
    </NavigationContainer>
  );
}
