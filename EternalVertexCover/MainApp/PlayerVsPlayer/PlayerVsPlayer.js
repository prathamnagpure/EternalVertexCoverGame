import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import GraphPreview from '../../components/GraphPreview';
import stages from '../../assets/Stages';
const pvplevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const PlayerVsPlayer = ({navigation}) => {
  const numberOfLevels = 16;

  // Create an array to store buttons
  const levelButtons = [];

  // Use a loop to create buttons for each level
  for (let i = 1; i <= numberOfLevels; i++) {
    const level = i;
    const buttonLabel = `Level ${level}`;

    levelButtons.push(
      <Pressable
        style={{
          borderWidth: 1,
          width: 310,
        }}
        key={level}
        onPress={() => navigation.navigate('Level1', {levelno: i - 1})}>
        <Text
          style={{
            alignSelf: 'center',
            position: 'relative',
            fontWeight: 'bold',
            color: '#888',
            fontSize: 20,
          }}>
          {buttonLabel}
        </Text>
        <GraphPreview
          stage={stages[pvplevels[i - 1]]}
          height={300}
          width={300}
        />
      </Pressable>,
    );
  }
  return (
    <View style={styles.container}>
      <View style={{marginTop: 100}}>
        <Text style={styles.title}>PlayerVsPlayer Page</Text>
      </View>
      <View
        style={{
          marginTop: 50,
          justifyContent: 'center',
          width: 320,
          height: 400,
        }}>
        <FlatList
          horizontal
          data={levelButtons}
          // initialScrollIndex={5}
          renderItem={({item}) => item}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white', // Set the title color to white in dark mode
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginVertical: 20,
  },
});

export default PlayerVsPlayer;
