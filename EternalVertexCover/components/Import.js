import React, {useCallback, useEffect, useState} from 'react';
import {View, Button, StyleSheet, Pressable, Text} from 'react-native';
import {pickSingle} from 'react-native-document-picker';
import {readDir, DocumentDirectoryPath, readFile} from 'react-native-fs';

export default function Import({navigation}) {
  const [levels, setLevels] = useState([]);

  const process = useCallback(async function () {
    const files = await readDir(DocumentDirectoryPath);
    const newLevels = [];
    for (const file of files) {
      if (file.isDirectory()) {
        const innerFiles = await readDir(file.path);
        for (const innerFile of innerFiles) {
          const parts = innerFile.path.split('/');
          const name = parts.pop() || parts.pop();
          const content = await readFile(innerFile.path);
          const stage = JSON.parse(content);
          console.log(stage);
          newLevels.push({
            name: name.replace(/\.[^/.]+$/, ''),
            stage,
          });
        }
      }
    }
    setLevels(newLevels);
  }, []);

  useEffect(() => {
    process();
    return () => {};
  }, [process]);

  async function onImportClick() {
    try {
      const result = await pickSingle({copyTo: 'documentDirectory'});
      const files = await readDir(DocumentDirectoryPath);
      for (const file of files) {
        if (file.isDirectory()) {
          console.log(await readDir(file.path));
        }
      }
    } catch {
    } finally {
      process();
    }
  }

  return (
    <View style={styles.container}>
      <Button title="import" onPress={onImportClick} />
      {levels.map((level, index) => (
        <Pressable
          key={'level' + index}
          style={styles.button}
          onPress={() =>
            navigation.navigate('Level1', {stage: levels[index].stage})
          }>
          <Text style={styles.text}>{level.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    backgroundColor: '#ccc',
    color: '#000',
    top: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },

  text: {
    color: 'black',
  },

  container: {
    flex: 1,
  },
});
