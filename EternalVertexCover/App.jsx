import React, {useEffect, useState, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Sound from 'react-native-sound';
import MainNavigator from './navigation/MainNavigator';
import {AppState} from 'react-native';
import AnimationSpeedContext from './contexts/AnimationSpeedContext';
import InGameVolumeContext from './contexts/InGameVolumeContext';
import BackgroundMusicVolumeContext from './contexts/BackGroundMusicContext';
import {getData, setData} from './utils/storage';
import CompletedLevelsContext from './contexts/CompletedLevelsContext';

function isNullOrUndefined(value) {
  return value === null || value === undefined;
}

export default function App() {
  const [animationSpeed, setAnimationSpeed] = useState(7);
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0.4);
  const [inGameVolume, setInGameVolume] = useState(1.0);
  const [count, setCount] = useState(0);
  const [completedLevels, setCompletedLevels] = useState({
    completedAttackerLevels: [],
    completedDefenderLevels: [],
  });

  const changeVolume = useCallback(
    function changeVolume(newVolume) {
      setBackgroundMusicVolume(newVolume);
      backgroundMusic?.setVolume(newVolume);
    },
    [backgroundMusic],
  );

  useEffect(() => {
    getData('completedLevels').then(value => {
      if (!isNullOrUndefined(value)) {
        setCompletedLevels(value);
      }
    });

    getData('animationSpeed').then(value => {
      console.log('animation speed', value);
      setCount(prev => prev + 1);
      if (!isNullOrUndefined(value)) {
        setAnimationSpeed(value);
      }
    });
    getData('inGameVolume').then(value => {
      console.log('in game volume', value);
      setCount(prev => prev + 1);
      if (!isNullOrUndefined(value)) {
        setInGameVolume(value);
      }
    });
    const mainBGM = new Sound('mainBGM.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('error in creating mainBGM', error);
        return;
      }
      setBackgroundMusic(mainBGM);
      console.log('sound successfully created ');
      while (mainBGM.isLoaded() === false) {}
      getData('backgroundMusicVolume').then(value => {
        console.log('background music volume', value);
        setCount(prev => prev + 1);
        if (!isNullOrUndefined(value)) {
          setBackgroundMusicVolume(value);
          mainBGM.setVolume(value);
        } else {
          mainBGM.setVolume(0.4);
        }
      });
      mainBGM.setNumberOfLoops(-1);
      mainBGM.setVolume(0);
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
      console.log('status', status);
      if (status === 'background' || status === 'inactive') {
        mainBGM?.pause();
      } else if (status === 'active') {
        mainBGM?.play();
      }
    };
    const soundHandler = AppState.addEventListener('change', listener);
    return () => {
      soundHandler.remove();
      mainBGM?.release();
    };
  }, []);

  function updateCompletedLevels(newCompletedLevels) {
    console.log(newCompletedLevels);
    setCompletedLevels(newCompletedLevels);
    setData('completedLevels', newCompletedLevels);
  }

  return (
    <AnimationSpeedContext.Provider value={{animationSpeed, setAnimationSpeed}}>
      <InGameVolumeContext.Provider value={{inGameVolume, setInGameVolume}}>
        <BackgroundMusicVolumeContext.Provider
          value={{
            backgroundMusicVolume,
            setBackgroundMusicVolume,
            changeVolume,
          }}>
          <CompletedLevelsContext.Provider
            value={{completedLevels, updateCompletedLevels}}>
            <NavigationContainer independent={true}>
              {count >= 3 && <MainNavigator />}
            </NavigationContainer>
          </CompletedLevelsContext.Provider>
        </BackgroundMusicVolumeContext.Provider>
      </InGameVolumeContext.Provider>
    </AnimationSpeedContext.Provider>
  );
}
