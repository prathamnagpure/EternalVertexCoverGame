import React from 'react';
import Images from '../assets/Images';
import {View, Text, StyleSheet, Pressable, ImageBackground} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import images from '../assets/Images';
import {horizontalScale, verticalScale} from '../utils/scaler';

const positions = [
  [0, verticalScale(400)],
  [horizontalScale(200), verticalScale(200)],
  [0, verticalScale(200)],
  [horizontalScale(200), verticalScale(400)],
];

function Mode({navigation}) {
  const position = useSharedValue(0);
  const rotation = useSharedValue(0);
  const width = useSharedValue(1);
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
      <Animated.Image source={images.naugtypig} style={animatedStyle} />
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('Endless', {
                numGuards: 200,
                numMoves: 1,
                time: 30,
              })
            }>
            <Text style={styles.text}>Easy</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('Endless', {
                numGuards: 300,
                numMoves: 2,
                time: 60,
              })
            }>
            <Text style={styles.text}> Normal </Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('Endless', {
                numGuards: 400,
                numMoves: 3,
                time: 60,
              })
            }>
            <Text style={styles.text}> Hard </Text>
          </Pressable>
        </View>
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
    gap: verticalScale(10),
    padding: 0,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: horizontalScale(32),
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 204, 0.9)',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    paddingLeft: horizontalScale(20),
    paddingRight: horizontalScale(20),
    borderRadius: horizontalScale(10),
    width: horizontalScale(200),
  },
  text: {
    color: '#AA336A',
    fontSize: horizontalScale(20),
    fontWeight: 'bold',
  },
  settingsIcon: {
    top: verticalScale(9),
    left: horizontalScale(300),
  },
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: horizontalScale(10),
  },
});

export default Mode;
