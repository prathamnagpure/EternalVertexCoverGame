import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  Dimensions,
  StyleSheet,
  Button,
  Modal,
  TextInput,
} from 'react-native';
import TouchableCircle from './TouchableCircle';
import TouchableLine from './TouchableLine';
import {readFile, writeFile, DownloadDirectoryPath} from 'react-native-fs';
import {pickSingle} from 'react-native-document-picker';
import ImportIcon from './icons/ImportIcon';
import ExportIcon from './icons/ExportIcon';
import EraserIcon from './icons/EraserIcon';
import AddIcon from './icons/AddIcon';

const windowHeight = Dimensions.get('window').height;
const states = {
  addButton: 1,
  addLine: 2,
  selectButton1: 3,
  selectButton2: 4,
  remove: 5,
  addGuards: 6,
};
export default function GraphMaker() {
  const [state, setState] = useState(states.addButton);
  const [fpoint, setfpoint] = useState(null);
  const [points, setpoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [guards, setGuards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [number, setNumber] = useState('');

  const handleInputChange = text => {
    // Validate input if needed
    setNumber(text);
  };
  function forExport(inputValue, num) {
    let str = 'diagraph G {\n';
    points.forEach((element, index) => {
      str +=
        index + ' ' + '[label=' + '"' + element[0] + ' ' + element[1] + '"]\n';
    });
    lines.forEach(element => {
      str += `${element[0]} -- ${element[1]}\n`;
    });
    str += '}';
    console.log(str);
    const obj = {graph: str, guardCount: guards.length, moves: num, guards};
    writeFile(
      DownloadDirectoryPath + `/${inputValue}.txt`,
      JSON.stringify(obj),
    );
  }
  async function forImport() {
    try {
      const result = await pickSingle({copyTo: 'cachesDirectory'});
      const file = await readFile(result.fileCopyUri);
      console.log(file);
      const obj = JSON.parse(file);
      const parse = require('dotparser');
      let ast = null;
      try {
        ast = parse(obj.graph);
      } catch {
        console.log('error cant parse');
        console.log(obj.graph);
        return;
      }
      if (!ast) {
        return;
      }
      const ppoints = [];
      const llines = [];
      const children = ast[0].children;
      for (const element of children) {
        if (element.type === 'node_stmt') {
          let coordinates = element.attr_list[0].eq.split(' ');
          ppoints.push([
            parseFloat(coordinates[0]),
            parseFloat(coordinates[1]),
          ]);
        } else {
          llines.push([
            parseInt(element.edge_list[0].id),
            parseInt(element.edge_list[1].id),
          ]);
        }
      }
      console.log({ppoints, llines});
      setpoints(ppoints);
      setLines(llines);
      setGuards(obj.guards);
    } catch (error) {
      console.log(error);
      console.log('second one ');
    }
  }
  const handleSubmit = () => {
    // Process the submitted value here
    console.log('Submitted value:', inputValue);
    forExport(inputValue, number);
    setModalVisible(false);
  };
  useEffect(() => console.log({lines, points}), [lines, points]);
  //   function changeState({locationX, locationY}) {}
  function lineRemove(id) {
    if (state == states.remove) {
      setLines(prev => {
        return prev.filter((value, index) => {
          return index !== id;
        });
      });
    }
  }
  function lineCreater(id) {
    console.log('called');
    if (state == states.addLine) {
      setState(states.selectButton1);
      setfpoint(id);
    } else if (state === states.selectButton1) {
      if (fpoint !== id) {
        // setState(states.addButton);
        setLines(prev => {
          return [...prev, [fpoint, id]];
        });
        setfpoint(null);
      }
    } else if (state === states.remove) {
      if (guards.includes(id)) {
        setGuards(prev => {
          return prev.filter(value => {
            return value !== id;
          });
        });
      } else {
        setLines(prev => {
          return prev.filter(value => {
            return value[0] !== id && value[1] !== id;
          });
        });
        setpoints(prev => {
          return prev.filter((value, index) => {
            return index !== id;
          });
        });
      }
    } else if (state === states.addGuards) {
      setGuards(prev => {
        return [...prev, id];
      });
    }
  }
  function userClick(event) {
    const {locationX, locationY} = event.nativeEvent;
    console.log('userClicked');
    if (state == states.addButton) {
      setpoints(prev => {
        return [...prev, [locationX, locationY]];
      });
    }
    // changeState({locationX, locationY});
    console.log(points);
  }
  return (
    <View style={[styles.container, {height: windowHeight}]}>
      <View style={styles.leftElement}>
        <Pressable
          style={styles.button}
          onPress={() => {
            setState(states.addButton);
          }}>
          <AddIcon color={state === states.addButton ? 'black' : 'gray'} />
          <Text
            style={{
              color: state === states.addButton ? 'black' : 'gray',
            }}>
            Node
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            setState(states.addLine);
          }}>
          <AddIcon color={state === states.addLine ? 'black' : 'gray'} />
          <Text
            style={{
              color: state === states.addLine ? 'black' : 'gray',
            }}>
            Edge
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => {
            setState(states.addGuards);
          }}>
          <AddIcon color={state === states.addGuards ? 'black' : 'gray'} />
          <Text
            style={{
              color: state === states.addGuards ? 'black' : 'gray',
            }}>
            Guard
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setState(states.remove);
          }}>
          <EraserIcon color={state === states.remove ? 'black' : 'gray'} />
        </Pressable>
        <Pressable
          onPress={() => {
            // forExport();
            setModalVisible(true);
            console.log('doing export');
          }}>
          <Text>
            <ExportIcon />
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            forImport();
            console.log('doing import');
          }}>
          <ImportIcon />
        </Pressable>
      </View>

      <Pressable style={styles.rightElement} onPressIn={userClick}>
        {lines.map((value, index) => {
          return (
            <TouchableLine
              x1={points[value[0]][0]}
              x2={points[value[1]][0]}
              y2={points[value[1]][1]}
              y1={points[value[0]][1]}
              thickness={17}
              id={index}
              onEdgePress={lineRemove}
              key={index + 'line'}
            />
          );
        })}
        {points.map((value, index) => {
          return (
            <TouchableCircle
              x={value[0]}
              y={value[1]}
              radius={30}
              id={index}
              key={index}
              showGuard={lineCreater}
              isGuardPresent={guards.includes(index)}
            />
          );
        })}
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{color: '#000'}}>Export</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
              placeholder="File name"
              placeholderTextColor={'gray'}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number of moves"
              placeholderTextColor={'gray'}
              value={number}
              onChangeText={handleInputChange}
            />
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
  },
  leftElement: {
    flex: 0, // Set the left element to take up 20% of the width
    flexDirection: 'row',
    gap: 10,
    height: '7%',
    fontSize: 5,
    backgroundColor: 'lightblue',
    padding: 10,
  },
  rightElement: {
    flex: 1, // Set the right element to take up the remaining space
    backgroundColor: 'lightgreen',
    padding: 10,
  },
  mcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: '#000',
    width: 150,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
