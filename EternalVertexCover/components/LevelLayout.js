import React from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import GraphPreview from './GraphPreview';
import stages from '../assets/Stages';

const LevelLayout = ({navigation, route}) => {
  const {levels, mode} = route.params;
  const levelButtons = levels.map((level, index) => {
    const buttonLabel = `Level ${index + 1}`;

    return (
      <Pressable
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: '3%',
          width: 310,
        }}
        key={level}
        onPress={() =>
          navigation.navigate('Level', {levelno: level, mode, index})
        }>
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
        <GraphPreview stage={stages[level]} height={300} width={300} />
      </Pressable>
    );
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 50,
          justifyContent: 'center',
          width: 320,
          height: 600,
        }}>
        <FlatList
          //horizontal
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

export default LevelLayout;
