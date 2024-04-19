import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Text, Modal} from 'react-native';
import {pickSingle} from 'react-native-document-picker';
import {
  readDir,
  DocumentDirectoryPath,
  readFile,
  unlink,
} from 'react-native-fs';
import {FlatList} from 'react-native-gesture-handler';
import {
  ImportHeader,
  DeleteButton,
  CancelDeleteButton,
  GraphPreview,
} from '../components';
import {MODES} from '../constants';
import {horizontalScale, verticalScale} from '../utils/scaler';

export default function Import({navigation}) {
  const [levels, setLevels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [filterString, setFilterString] = useState('');
  const [isModeModalVisible, setIsModeModalVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const process = useCallback(async function () {
    const files = await readDir(DocumentDirectoryPath);
    const newLevels = [];
    for (const file of files) {
      if (file.isDirectory()) {
        const innerFiles = await readDir(file.path);

        for (const innerFile of innerFiles) {
          const level = {};
          level.fullName = innerFile.path;
          const parts = innerFile.path.split('/');
          const name = parts.pop() || parts.pop();
          level.name = name.replace(/\.[^/.]+$/, '');
          try {
            const content = await readFile(innerFile.path);
            level.stage = JSON.parse(content);
          } catch (err) {
            console.log({err, path: innerFile.path});
          }
          newLevels.push(level);
        }
      }
    }
    setLevels(newLevels);
  }, []);

  useEffect(() => {
    process();
    return () => {};
  }, [process]);

  const showInitialIcons = useCallback(
    function () {
      navigation.setOptions({
        headerLeft: undefined,
        headerRight: () =>
          ImportHeader(
            setIsModalVisible,
            isSearchClicked,
            filterString,
            setFilterString,
            setIsSearchClicked,
          ),
        title: isSearchClicked ? '' : 'Imported levels',
      });
    },
    [navigation, isSearchClicked, filterString],
  );

  const handleDeletePress = useCallback(function () {
    setItemsToDelete(prevItems => {
      setLevels(prevLevels => {
        prevItems.forEach(value => {
          const parts = prevLevels[value].fullName.split('/');
          parts.pop() || parts.pop();
          const folderName = parts.join('/');
          unlink(folderName);
        });

        return prevLevels.filter((_, index) => !prevItems.includes(index));
      });
      return [];
    });

    setIsMultiSelectEnabled(false);
  }, []);

  const cancelDelete = useCallback(function () {
    setItemsToDelete([]);
    setIsMultiSelectEnabled(false);
  }, []);

  const showDeleteIcon = useCallback(
    function () {
      navigation.setOptions({
        title: `Selected ${itemsToDelete.length}`,
        headerRight: () => DeleteButton(handleDeletePress),
        headerLeft: () => CancelDeleteButton(cancelDelete),
        headerBackVisible: false,
      });
    },
    [navigation, itemsToDelete.length, cancelDelete, handleDeletePress],
  );

  useEffect(() => {
    if (isMultiSelectEnabled) {
      showDeleteIcon();
    } else {
      showInitialIcons();
    }
  }, [showInitialIcons, isMultiSelectEnabled, showDeleteIcon]);

  async function onImportClick() {
    try {
      await pickSingle({copyTo: 'documentDirectory'});
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

  function goToLevel(mode) {
    setIsModeModalVisible(false);
    let {stage, name} = selectedStage;
    if (mode === MODES.AUTO_DEFENDER && selectedStage.moves % 2 === 0) {
      stage = {...selectedStage, moves: selectedStage.moves - 1};
    }
    navigation.navigate('Level', {stage, mode, title: name});
  }

  function handleListItemPress(stage, index, name) {
    if (isMultiSelectEnabled) {
      setItemsToDelete(prev => {
        if (prev.includes(index)) {
          return prev.filter(value => value !== index);
        } else {
          return [...prev, index];
        }
      });
    } else {
      setSelectedStage({stage, name});
      setIsModeModalVisible(true);
    }
  }

  const levelsToShow = levels.filter(level =>
    level.name.includes(filterString),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={levelsToShow}
        renderItem={({item, index}) => {
          return (
            <Pressable
              key={'level' + index}
              style={
                itemsToDelete.includes(index)
                  ? [styles.button, styles.pinkBackground]
                  : styles.button
              }
              onPress={() =>
                handleListItemPress(levels[index].stage, index, item.name)
              }>
              <Text style={styles.text}>{item.name}</Text>
              <GraphPreview
                stage={levels[index].stage}
                height={verticalScale(200)}
                width={horizontalScale(200)}
              />
            </Pressable>
          );
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModeModalVisible}
        onRequestClose={() => {
          setIsModeModalVisible(false);
        }}>
        <Pressable
          style={styles.modalBackground}
          onPressOut={() => setIsModeModalVisible(false)}>
          <View style={styles.modeModalContainer}>
            <Pressable
              onPress={() => goToLevel(null)}
              style={[styles.bottomBorder, styles.modalButton]}>
              <Text style={styles.text}>PvP</Text>
            </Pressable>
            <Pressable
              onPress={() => goToLevel(MODES.AUTO_DEFENDER)}
              style={[styles.bottomBorder, styles.modalButton]}>
              <Text style={styles.text}>Pig</Text>
            </Pressable>
            <Pressable
              onPress={() => goToLevel(MODES.AUTO_ATTACKER)}
              style={[styles.modalButton]}>
              <Text style={styles.text}>Janitor</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}>
        <Pressable
          style={styles.modalBackground}
          onPressOut={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Pressable
              onPress={onImportClick}
              style={[styles.bottomBorder, styles.modalButton]}>
              <Text style={styles.text}>Import</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                showDeleteIcon();
                setIsModalVisible(false);
                setIsMultiSelectEnabled(true);
              }}>
              <Text style={styles.text}>Select multiple items</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: '2%',
    paddingLeft: '10%',
    backgroundColor: '#999',
    color: '#000',
    top: '2%',
    margin: '2%',
    marginLeft: '3%',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: horizontalScale(10),
  },

  text: {
    color: 'black',
    alignSelf: 'center',
    fontSize: horizontalScale(16),
  },

  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#000',
  },

  modalBackground: {
    flex: 1,
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalButton: {
    padding: horizontalScale(5),
  },

  pinkBackground: {
    backgroundColor: 'pink',
  },

  lineThrough: {
    textDecorationLine: 'line-through',
  },

  importButton: {
    backgroundColor: '#cba',
  },

  modalContainer: {
    backgroundColor: '#fff',
    alignContent: 'center',
    padding: 5,
    top: '7%',
    left: '50%',
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
    borderColor: '#000',
    borderWidth: horizontalScale(2),
    borderRadius: horizontalScale(10),
  },

  modeModalContainer: {
    top: '10%',
    backgroundColor: '#fff',
    alignContent: 'center',
    padding: horizontalScale(5),
    alignSelf: 'center',
    justifyContent: 'flex-end',
    borderColor: '#000',
    borderWidth: horizontalScale(2),
    borderRadius: horizontalScale(10),
  },
  bottomBorder: {
    borderBottomWidth: verticalScale(1),
    borderColor: '#aaa',
  },
});
