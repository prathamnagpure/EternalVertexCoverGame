import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text, Button, Image} from 'react-native';

import Animated, {withTiming} from 'react-native-reanimated';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';
import Sound from 'react-native-sound';
import {MyModal, PinkArrow} from '../components'

export default function ForTest() {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const butwidth = useSharedValue(100);
  const [modalVisible, setModalVisible] = useState(true);
  const [top, setTop] = useState(200);
  const [left, setLeft] = useState(200);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  const sound = new Sound('fart.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    console.log(
      'duration in seconds: ' +
        sound.getDuration() +
        'number of channels: ' +
        sound.getNumberOfChannels(),
    );

    // Play the sound with an onEnd callback
    sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  });
  // const translateY = useSharedValue(0);

  const handlePress = () => {
    sound.play();
    translateX.value += 100;
    rotation.value += 720;
    opacity.value = withTiming(1, {duration: 5000}, () => {
      opacity.value = withTiming(0, {duration: 100});
    });
    // translateY.value += 50;
  };

  butwidth.value = withRepeat(withSpring(150), -1);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value, {duration: 5000}),
      },
      {
        translateY: withTiming(translateX.value, {duration: 5000}),
      },
      {
        rotate: withTiming(`${rotation.value}deg`, {duration: 5000}),
      },
    ],
  }));
  const animatedStylesFire = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateX: withTiming(translateX.value, {duration: 5000}),
      },
      {
        translateY: withTiming(translateX.value, {duration: 5000}),
      },
    ],
  }));
  const startx = 100;
  const starty = 100;
  return (
    <View style={{height: 500, flex: 1, flexDirection: 'column'}}>
      {/* <View>
        <Pressable onPress={() => {}}>
          <Text>Poop</Text>
        </Pressable>
      </View> */}
      {
        // <PinkArrow x1={10} y1={400} x2={100} y2={100} />
        // <MyModal
        //   modalVisible={modalVisible}
        //   onClickNext={() => setModalVisible(false)}
        //   x={600}
        //   y={400}
        //   text={'these are the steps\n step1. \n step2 \n step3 '}
        // />
      }
      {/* <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            flex: 1,
            width: butwidth,
            height: butwidth,
            justifyContent: 'center', // Center vertically
            alignItems: 'center',
          },
        ]}>
        <Animated.Image
          style={{
            width: butwidth,
            height: butwidth,
          }}
          source={Images.pigpoop}
        />
      </Animated.View>
      <Animated.View style={[styles.firebox, animatedStylesFire]}>
        <Image style={[styles.fireimage]} source={Images.fire} />
      </Animated.View>
      <Animated.View style={[styles.box, animatedStyles]}>
        <Image style={styles.image} source={Images.poop} />
      </Animated.View> */}
      {/* //adding garbage. */}
      {/* <Pressable /> */}
      {/* <View style={styles.container}> */}
      {/* <Image style={styles.image} source={Images.garbage} /> */}
      {/* <Pressable
        style={{
          borderColor: 'red',
          borderWidth: 50,
          top: 300,
          left: 500,
          alignSelf: 'flex-end',
        }}
        onPress={handlePress}>
        <Text>click me</Text>
      </Pressable>
      <Guard
        top={300}
        left={500}
        width={70}
        height={70}
        id="1"
        onPress={() => console.log('hello')}
        shouldAnimate={shouldAnimate}
        leftAfterAnimation={100}
        topAfterAnimation={100}
        runAfterAnimation={() => {
          console.log('Ran 100 100');
          setShouldAnimate(false);
          setTop(100);
          setLeft(100);
        }}
      /> */}

      {/* </View> */}
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'blue',
    // borderRadius: ,
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    margin: 10,
    top: 50,
    left: 50,
  },
  firebox: {
    position: 'absolute',
    width: 100,
    height: 100,
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    // backgroundColor: 'red',
    // borderRadius: ,
    margin: 10,
    top: 0,
    left: 0,
  },
  image: {
    // width: 50,
    // height: 50,
    width: 70,
    height: 70,
    resizeMode: 'stretch',
    transform: [{rotate: '-45deg'}],
  },
  fireimage: {
    // width: 50,
    // height: 50,
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    transform: [{rotate: '-45deg'}],
  },
});
