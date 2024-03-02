import React from 'react';
import Images from '../assets/Images';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import images from '../assets/Images';
const attackerLevels = [7, 8, 9, 10, 11, 12, 13];
const defenderLevels = [2, 3, 4, 5, 6, 14, 15];
const pvpLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const positions = [
  [0, 400],
  [250, 200],
  [0, 200],
  [250, 400],
];
const countPos = 4;
let angleSt = 1;
const MainPage = ({navigation}) => {
  const position = useSharedValue(0);
  const rotation = useSharedValue(0);
  const width = useSharedValue(1);
  // const image = useSharedValue(Images.naugtypig);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(positions[position.value][0], {duration: 3000}),
      top: withTiming(positions[position.value][1], {duration: 3000}, () => {
        position.value = (position.value + 1) % countPos;
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
      style={{
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
      }}>
      {/* <Text style={styles.title}>Eternal Vertex Cover</Text> */}
      <Animated.Image
        source={images.naugtypig}
        style={[{position: 'absolute'}, animatedStyle]}
      />
      <Image style={{marginBottom: 0}} source={Images.title} />
      <View style={styles.container}>
        <Pressable
          style={styles.button}
          title=""
          onPress={() =>
            navigation.navigate('LevelLayout', {
              levels: attackerLevels,
              title: 'Attacker',
            })
          }>
          <Text style={styles.text}>Attacker</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          title=""
          onPress={() =>
            navigation.navigate('LevelLayout', {
              levels: defenderLevels,
              title: 'Defender',
            })
          }>
          <Text style={styles.text}>Defender</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          title=""
          onPress={() =>
            navigation.navigate('LevelLayout', {
              levels: pvpLevels,
              title: 'Player Vs Player',
            })
          }>
          <Text style={styles.text}>Player vs Player</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          title=""
          onPress={() => navigation.navigate('Imported Levels')}>
          <Text style={styles.text}>Imported levels</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          title=""
          onPress={() => navigation.navigate('graphMaker')}>
          <Text style={styles.text}>graphmaker</Text>
        </Pressable>
        {
          // <Pressable
          //   style={styles.button}
          //   title=""
          //   onPress={() => navigation.navigate('testarea')}>
          //   <Text style={styles.text}>testarea</Text>
          // </Pressable>
        }
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: 'pink',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    marginTop: 10,
    marginVertical: 10,
  },
  text: {
    color: '#AA336A',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainPage;
