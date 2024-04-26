import React from 'react';
import Images from '../assets/Images';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import images from '../assets/Images';
import stages from '../assets/Stages';
import {
  ATTACKER_LEVELS,
  PVP_LEVELS,
  DEFENDER_LEVELS,
  MODES,
} from '../constants';
import {horizontalScale, verticalScale} from '../utils/scaler';
import SettingsIcon from '../components/icons/SettingsIcon';

const positions = [
  [0, verticalScale(400)],
  [horizontalScale(200), verticalScale(200)],
  [0, verticalScale(200)],
  [horizontalScale(200), verticalScale(400)],
];

function MainPage({navigation}) {
  const position = useSharedValue(0);
  const rotation = useSharedValue(0);
  const width = useSharedValue(1);
  // const image = useSharedValue(Images.naugtypig);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: withTiming(positions[position.value][0], {duration: 3000}),
      top: withTiming(positions[position.value][1], {duration: 3000}, () => {
        position.value = (position.value + 1) % positions.length;
        rotation.value += 360;
        width.value = width.value === 1 ? 0.8 : 1;
        // image.value = Images.guard;
      }),
      // width: withRepeat(withSpring(400), -1),
      transform: [
        {
          rotate: withTiming(`${rotation.value}deg`, {duration: 1500}),
        },
        {
          scale: withTiming(width.value, {duration: 3000}),
        },
      ],
    };
  });

  return (
    <ImageBackground
      source={Images.farmbg}
      resizeMode="cover"
      style={styles.imageBackground}>
      {/* <Text style={styles.title}>Eternal Vertex Cover</Text> */}
      <Animated.Image source={images.naugtypig} style={animatedStyle} />
      <View style={styles.settingsButtonContainer}>
        <Pressable
          android_ripple={{color: '#444'}}
          style={styles.settingsIcon}
          onPressIn={() => navigation.navigate('Settings')}>
          <SettingsIcon size={horizontalScale(30)} />
        </Pressable>
      </View>
      <Image
        style={styles.titleImage}
        resizeMode="contain"
        source={Images.title}
      />
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('Tutorial', {
                title: 'How to Play',
              })
            }>
            <Text style={styles.text}>How to Play</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('LevelLayout', {
                levels: ATTACKER_LEVELS,
                mode: MODES.AUTO_DEFENDER,
                title: 'Play as Pig',
              })
            }>
            <Text style={styles.text}>Play As Pig</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('LevelLayout', {
                levels: DEFENDER_LEVELS,
                mode: MODES.AUTO_ATTACKER,
                title: 'Play as Janitors',
              })
            }>
            <Text style={styles.text}>Play As Janitors</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('LevelLayout', {
                levels: PVP_LEVELS,
                title: 'Player Vs Player',
              })
            }>
            <Text style={styles.text}>Player vs Player</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() => navigation.navigate('Imported Levels')}>
            <Text style={styles.text}>Imported Levels</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() => navigation.navigate('Graph Maker')}>
            <Text style={styles.text}>Level Maker</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('Mode', {
                title: 'Endless mode',
                // numGuards: 5,
                // numMoves: 2,
              })
            }>
            <Text style={styles.text}>Endless Mode</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() => {
              navigation.navigate('Empty');
              navigation.navigate('StageWrap', {
                time: 30,
                numGuards: 50,
                numMoves: 2,
                numNode: 4,
                numEdge: 3,
                score: 0,
              });
            }}>
            <Text style={styles.text}>Endless Janitor</Text>
          </Pressable>
        </View>

        {
          // <Pressable
          //   style={styles.button}
          //   onPress={() => navigation.navigate('testarea')}>
          //   <Text style={styles.text}>testarea</Text>
          // </Pressable>
        }
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: '#90EE90',
    gap: verticalScale(8),
    padding: 0,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
    // gap: 5,
  },
  title: {
    fontSize: horizontalScale(32),
    fontWeight: 'bold',
    // color: '', // Set the title color to white in dark mode
  },
  titleImage: {
    marginBottom: 0,
    marginTop: 0,
    top: 0,
    height: '30%',
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 204, 0.9)',
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(5),
    paddingLeft: horizontalScale(20),
    paddingRight: horizontalScale(20),
    borderRadius: horizontalScale(10),
    width: horizontalScale(200),
  },
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: horizontalScale(10),
  },
  settingsButtonContainer: {
    overflow: 'hidden',
  },
  text: {
    color: '#AA336A',
    fontSize: horizontalScale(20),
    fontWeight: 'bold',
  },
  settingsIcon: {
    borderRadius: horizontalScale(300),
    alignSelf: 'flex-end',
    margin: verticalScale(5),
  },
});

export default MainPage;
