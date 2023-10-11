import React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';

const Defender = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Defender Page</Text>
      </View>

      <Button
        style={styles.button}
        title="Level 1"
        onPress={() => navigation.navigate('DLevel1')}
      />
      <Button
        style={styles.button}
        title="Level 2"
        onPress={() => navigation.navigate('DLevel2')}
      />
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
