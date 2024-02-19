import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';

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
          backgroundColor: 'white',
          borderWidth: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'red',
          marginLeft: 20,
          width: 200,
        }}
        key={level}
        onPress={() => navigation.navigate('Level1', {levelno: i - 1})}>
        {/* //absolute karna he */}
        <Text style={{position: 'relative', left: 20, fontWeight: 'bold'}}>
          {buttonLabel}
        </Text>
      </Pressable>,
    );
  }
  return (
    <View style={styles.container}>
      <View style={{marginTop: 100}}>
        <Text style={styles.title}>PlayerVsPlayer Page</Text>
      </View>
      <View style={{height: 200, marginTop: 50, justifyContent: 'center'}}>
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
