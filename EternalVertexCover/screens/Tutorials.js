import React from 'react';
import Images from '../assets/Images';
import {View, StyleSheet, Pressable, ImageBackground} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import images from '../assets/Images';
import stages from '../assets/Stages';
import {MODES} from '../constants';
import {horizontalScale, verticalScale} from '../utils/scaler';
import {SingleLineText} from '../components';

const positions = [
  [0, verticalScale(400)],
  [horizontalScale(200), verticalScale(200)],
  [0, verticalScale(200)],
  [horizontalScale(200), verticalScale(400)],
];

function Tutorials({navigation}) {
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
              navigation.navigate('Level', {
                mode: MODES.AUTO_DEFENDER,
                isAttackerTutorial: true,
                stage: stages[16],
                title: 'Pig Tutorial',
              })
            }>
            <SingleLineText style={styles.text}>Pig Tutorial </SingleLineText>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{color: '#AA336A'}}
            style={styles.button}
            onPress={() =>
              navigation.navigate('Level', {
                mode: MODES.AUTO_ATTACKER,
                isDefenderTutorial: true,
                stage: stages[17],
                title: 'Janitor Tutorial',
              })
            }>
            <SingleLineText style={styles.text}>
              Janitor Tutorial{' '}
            </SingleLineText>
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
    // gap: 5,
  },
  title: {
    fontSize: horizontalScale(32),
    fontWeight: 'bold',
    // color: '', // Set the title color to white in dark mode
  },
  titleImage: {
    marginBottom: 0,
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
  goBack: {
    top: verticalScale(9),
    left: horizontalScale(10),
  },
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: horizontalScale(10),
  },
});

export default Tutorials;
