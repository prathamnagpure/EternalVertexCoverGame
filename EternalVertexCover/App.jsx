import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Sound from 'react-native-sound';
import MainNavigator from './navigation/MainNavigator';
import {AppState} from 'react-native';

export default function App() {
  useEffect(() => {
    const mainBGM = new Sound('mainBGM.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('error in creating mainBGM', error);
        return;
      }
      console.log('sound successfully created ');
      while (mainBGM.isLoaded() === false) {}
      mainBGM.setNumberOfLoops(-1);
      mainBGM.setVolume(0.4);
      mainBGM.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      console.log(' app.jsx was the sound file loaded ', mainBGM.isLoaded());
    });

    const listener = status => {
      if (status === 'background' || status === 'inactive') {
        mainBGM?.pause();
      } else if (status === 'active') {
        mainBGM?.play();
      }
    };
    const soundHandler = AppState.addEventListener('change', listener);
    return () => {
      soundHandler.remove();
    };
  }, []);

  return (
    <NavigationContainer independent={true}>
      <MainNavigator />
    </NavigationContainer>
  );
}
