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

const positions = [
  [0, 400],
  [250, 200],
  [0, 200],
  [250, 400],
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
      <Image style={styles.titleImage} source={Images.title} />
      <View style={styles.container}>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('Level', {
              mode: 'autoDefender',
              isAttackerTutorial: true,
              stage: stages[16],
            })
          }>
          <Text style={styles.text}>Tutorial </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('LevelLayout', {
              levels: ATTACKER_LEVELS,
              mode: MODES.AUTO_DEFENDER,
              title: 'Attacker',
            })
          }>
          <Text style={styles.text}>Attacker</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('LevelLayout', {
              levels: DEFENDER_LEVELS,
              mode: MODES.AUTO_ATTACKER,
              title: 'Defender',
            })
          }>
          <Text style={styles.text}>Defender</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('LevelLayout', {
              levels: PVP_LEVELS,
              title: 'Player Vs Player',
            })
          }>
          <Text style={styles.text}>Player vs Player</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Imported Levels')}>
          <Text style={styles.text}>Imported levels</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Graph Maker')}>
          <Text style={styles.text}>Graph Maker</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('testarea')}>
          <Text style={styles.text}>testarea</Text>
        </Pressable>
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
    padding: 0,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // gap: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    // color: '', // Set the title color to white in dark mode
  },
  titleImage: {
    marginBottom: 0,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 204, 0.9)',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    marginTop: 10,
    marginVertical: 10,
    width: '55%',
  },
  text: {
    color: '#AA336A',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainPage;
