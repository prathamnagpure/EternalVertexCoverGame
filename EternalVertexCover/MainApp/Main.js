import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const MainPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eternal Vertex Cover</Text>
      <Button
        style={styles.button}
        title="Attacker"
        onPress={() => navigation.navigate('Attacker')}
      />
      <Button
        style={styles.button}
        title="Defender"
        onPress={() => navigation.navigate('Defender')}
      />
      <Button
        style={styles.button}
        title="Player vs Player"
        onPress={() => navigation.navigate('PlayerVsPlayer')}
      />
      <Button
        style={styles.button}
        title="Imported levels"
        onPress={() => navigation.navigate('Imported Levels')}
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
    gap: 10,
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
