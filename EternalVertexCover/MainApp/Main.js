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

const MainPage = ({navigation}) => {
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
      <Image style={{marginBottom: 0}} source={Images.title} />
      <View style={styles.container}>
        <Pressable
          style={styles.button}
          title=""
          onPress={() => navigation.navigate('Attacker')}>
          <Text style={styles.text}>Attacker</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          title=""
          onPress={() => navigation.navigate('Defender')}>
          <Text style={styles.text}>Defender</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          title=""
          onPress={() => navigation.navigate('PlayerVsPlayer')}>
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
        <Pressable
          style={styles.button}
          title=""
          onPress={() => navigation.navigate('testarea')}>
          <Text style={styles.text}>testarea</Text>
        </Pressable>
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
