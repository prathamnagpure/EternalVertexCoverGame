import React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';

const Defender = ({navigation}) => {
  const numberOfLevels = 4;

  // Create an array to store buttons
  const levelButtons = [];

  // Use a loop to create buttons for each level
  for (let i = 1; i <= numberOfLevels; i++) {
    const level = i;
    const buttonLabel = `Level ${level}`;

    levelButtons.push(
      <Button
        key={level}
        title={buttonLabel}
        onPress={() => navigation.navigate('DLevel1', {levelno: i - 1})}
      />,
    );
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Defender Page</Text>
      </View>

      {levelButtons}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
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

export default Defender;
