import {React, useState, useEffect, useRef, useCallback} from 'react';
import Images from '../assets/Images';
import {giveMap as giveMapA} from '../MainApp/MainAlgoBruteForce';
import {giveMap as giveMapD} from '../MainApp/MainAlgoBruteForceD';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Image,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import TouchableCircle from './TouchableCircle';
import TouchableLine from './TouchableLine';
import parse from 'dotparser';
import Sound from 'react-native-sound';
import {tupleToString} from '../MainApp/MainAlgoBruteForce';
import {
  Gesture,
  GestureHandlerRootView,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Poop from './Poop';
import Guard from './Guard';
let showAnimation = false;
const Turns = {
  DefenderFirst: 1,
  DefenderLater: 2,
  Attacker: 3,
};
const Winner = {
  Defender: 1,
  Attacker: 2,
};
const Modes = {
  AutoAttacker: 'autoAttacker',
  AutoDefender: 'autoDefender',
};

const circleCords = [
  {x: 200, y: 200, isSelected: false},
  {x: 250, y: 200, isSelected: false},
  {x: 200, y: 250, isSelected: false},
];
const lineCords = [
  {
    x1: 200,
    y1: 200,
    x2: 250,
    y2: 200,
    isAttacked: false,
    moveGuard1: false,
    moveGuard2: false,
  },
  {
    x1: 200,
    y1: 250,
    x2: 250,
    y2: 200,
    isAttacked: false,
    moveGuard1: false,
    moveGuard2: false,
  },
];
export default function Tutorial({stage, mode}) {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {renderEdges()}
        {renderNodes()}
        {renderGuards()}
      </View>
    </GestureHandlerRootView>
  );
}
function renderNodes() {
  return circleCords.map((value, index) => {
    return (
      <TouchableCircle
        key={index}
        radius={30}
        showGuard={showGuard}
        {...value}
      />
    );
  });
}
function renderEdges() {
  return lineCords.map((value, index) => {
    return (
      <TouchableLine
        key={index}
        thickness={17}
        onEdgePress={onEdgePress}
        {...value}
      />
    );
  });
}
function renderGuards() {
  return [...guardStateMap.keys()]
    .map(key => [key, guardStateMap.get(key)])
    .map(element => {
      const [key, value] = element;
      return (
        <Guard
          {...value}
          width={70}
          height={70}
          key={key + ' Guard'}
          id={key}
          animateRef={animate => {
            value.animateRef = animate;
          }}
          onPress={onGuardPress}
        />
      );
    });
}
function isAutomatic(mode) {
  return mode === Modes.AutoAttacker || mode === Modes.AutoDefender;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 30,
    // backgroundColor: 'yellow',
  },
  heading: {
    padding: 5,
    alignSelf: 'center',
    fontSize: 20,
    top: 5,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
    height: 33,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
  button: {
    backgroundColor: 'grey',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 600,
    width: '100%',
    alignSelf: 'center',
  },
  warning: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 500,
    color: 'red',
    fontSize: 15,
    alignSelf: 'center',
  },
  undo: {
    backgroundColor: 'grey',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 550,
    width: '20%',
    left: 50,
    alignSelf: 'center',
  },
  redo: {
    backgroundColor: 'grey',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 550,
    right: 50,
    width: '20%',
    alignSelf: 'center',
  },
});
