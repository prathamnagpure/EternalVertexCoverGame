import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const MainPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eternal Vertex Cover</Text>
      <Button
        style={styles.Button}
        title="Attacker"
        onPress={() => navigation.navigate('Attacker')}
      />
      <Button
        style={styles.Button}
        title="Defender"
        onPress={() => navigation.navigate('Defender')}
      />
      <Button
        style={styles.Button}
        title="Player vs Player"
        onPress={() => navigation.navigate('PlayerVsPlayer')}
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

export default MainPage;
