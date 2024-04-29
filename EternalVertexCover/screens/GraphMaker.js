import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';

import {TouchableLine, TouchableCircle, Guard} from '../components';
import {AddIcon} from '../components/icons';
import {readFile, writeFile, DownloadDirectoryPath} from 'react-native-fs';
import {pickSingle} from 'react-native-document-picker';
import {horizontalScale, verticalScale} from '../utils/scaler';
import {giveMap} from '../utils/MainAlgoBruteForce';
import {giveMap as giveMapD} from '../utils/MainAlgoBruteForceD';

const states = {
  addButton: 1,
  addLine: 2,
  selectButton1: 3,
  selectButton2: 4,
  remove: 5,
  addGuards: 6,
};

const modes = {janitor: 0, pig: 1, nothing: 2};
export default function GraphMaker() {
  const [state, setState] = useState(states.addButton);
  const [fpoint, setfpoint] = useState(null);
  const [points, setpoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [guards, setGuards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [number, setNumber] = useState('');
  const {height: windowHeight} = useWindowDimensions();
  const [mode, setMode] = useState(modes.nothing);
  // const [progress, setProgress] = useState(0);
  const [indicator, setIndicator] = useState(false);

  const handleInputChange = text => {
    // Validate input if needed
    setNumber(text);
  };

  function forExport(fileName, num) {
    let str = 'digraph G {\n';
    points.forEach((element, index) => {
      str +=
        index + ' ' + '[label=' + '"' + element[0] + ' ' + element[1] + '"]\n';
    });
    const adj = [];
    for (let i = 0; i < points.length; i++) {
      adj.push([]);
    }
    lines.forEach(element => {
      str += `${element[0]} -- ${element[1]}\n`;
      adj[element[0]].push(element[1]);
      adj[element[1]].push(element[0]);
    });
    str += '}';
    console.log(guards);
    let map;
    let whoIs = modes.nothing;
    setIndicator(true);
    if (mode === modes.janitor) {
      map = giveMap(guards.length, adj, lines, parseInt(num, 10) * 2);
      whoIs = modes.janitor;
    } else if (mode === modes.pig) {
      map = giveMapD(
        guards.length,
        guards,
        adj,
        lines,
        parseInt(num, 10) * 2 - 1,
      );
      whoIs = modes.pig;
    }
    const obj = {
      graph: str,
      guardCount: guards.length,
      moves: parseInt(num, 10) * 2,
      guards,
      map,
      whoIs,
    };
    writeFile(
      DownloadDirectoryPath + `/${fileName}.txt`,
      JSON.stringify(obj),
    ).then(() => {
      setIndicator(false);
      Alert.alert('Exported to Downloads');
    });
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
            parseInt(element.edge_list[0].id, 10),
            parseInt(element.edge_list[1].id, 10),
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
    console.log('balle balle');
    console.log('Submitted value:', inputValue);

    setModalVisible(false);
    setIndicator(true);
    setTimeout(() => forExport(inputValue, number), 0);
  };
  useEffect(() => console.log({lines, points}), [lines, points]);
  //   function changeState({locationX, locationY}) {}
  function lineRemove(id) {
    if (state === states.remove) {
      setLines(prev => {
        return prev.filter((value, index) => {
          return index !== id;
        });
      });
    }
  }
  function lineCreater(id) {
    if (state === states.addLine) {
      setState(states.selectButton1);
      setfpoint(id);
    } else if (state === states.selectButton1) {
      if (fpoint !== id) {
        setState(states.addLine);
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
          console.log({prev, id});
          const temp = prev.filter(value => {
            return value[0] !== id && value[1] !== id;
          });
          console.log(temp);
          return temp.map(value => {
            if (value[0] > id) {
              value[0]--;
            }
            if (value[1] > id) {
              value[1]--;
            }
            return value;
          });
        });
        setpoints(prev => {
          return prev.filter((_, index) => {
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
    if (state === states.addButton) {
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
            setfpoint(null);
            setState(states.addButton);
          }}>
          <AddIcon color={state === states.addButton ? 'black' : 'gray'} />
          <Text style={state === states.addButton ? styles.black : styles.gray}>
            Node
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            setfpoint(null);
            setState(states.addLine);
          }}>
          <AddIcon color={state === states.addLine ? 'black' : 'gray'} />

          <Text style={state === states.addLine ? styles.black : styles.gray}>
            Edge
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => {
            setfpoint(null);
            setState(states.addGuards);
          }}>
          <AddIcon color={state === states.addGuards ? 'black' : 'gray'} />
          <Text style={state === states.addGuards ? styles.black : styles.gray}>
            Guard
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setfpoint(null);
            setState(states.remove);
          }}>
          <Text style={state === states.remove ? styles.black : styles.gray}>
            Remove
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            // forExport();
            setModalVisible(true);
            console.log('doing export');
          }}>
          <Text style={styles.gray}>Export</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            forImport();
            console.log('doing import');
          }}>
          <Text style={styles.gray}>Import</Text>
        </Pressable>
      </View>

      <Pressable style={styles.rightElement} onPressIn={userClick}>
        {lines.map((value, index) => {
          console.log({points, value});
          return (
            <TouchableLine
              x1={points[value[0]][0]}
              x2={points[value[1]][0]}
              y2={points[value[1]][1]}
              y1={points[value[0]][1]}
              thickness={horizontalScale(17)}
              id={index}
              onPress={lineRemove}
              key={index + 'line'}
            />
          );
        })}
        {points.map((value, index) => {
          return (
            <TouchableCircle
              cx={value[0]}
              cy={value[1]}
              isSelected={index === fpoint}
              r={horizontalScale(30)}
              id={index}
              key={index}
              onPress={lineCreater}
              isGuardPresent={guards.includes(index)}
            />
          );
        })}
        {guards.map(
          value =>
            points[value] && (
              <Guard
                key={'Guard' + value}
                id={value}
                cx={points[value][0]}
                cy={points[value][1]}
                onPress={lineCreater}
                height={verticalScale(70)}
                width={horizontalScale(70)}
              />
            ),
        )}
      </Pressable>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.white}>Export</Text>
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
              <Button
                title={'PvP' + (mode === modes.nothing ? '👍' : '')}
                onPress={() => {
                  setMode(modes.nothing);
                }}
              />

              <Button
                title={'janitor' + (mode === modes.janitor ? '👍' : '')}
                onPress={() => {
                  setMode(modes.janitor);
                }}
              />
              <Button
                title={'pig' + (mode === modes.pig ? '👍' : '')}
                onPress={() => {
                  setMode(modes.pig);
                }}
              />
              <Text
                title=""
                style={{
                  backgroundColor: 'red',
                  padding: 20,
                  fontWeight: 'bold',
                  // alignContent: 'center',
                  // verticalAlign: 'center',
                }}
                onPress={handleSubmit}>
                Submit
              </Text>
              <Text
                title="Close"
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  fontWeight: 'bold',
                  // alignContent: 'center',
                  // verticalAlign: 'center',
                }}
                onPress={() => setModalVisible(false)}>
                Close
              </Text>
              {/* {progress > 0 && <Text>{progress}</Text>} */}
            </View>
          </View>
        </Modal>
      )}
      {/* <Modal animationType="slide" transparent={true} visible={progress > 0}>
        <Text style={{top: 500, bottom: 0, position: 'absolute'}}>
          progress is {'\n'}
          {progress}
        </Text>
      </Modal>
      <Text style={{top: 500, bottom: 0, position: 'absolute'}}>
        progress is {'\n'}
        {progress}
      </Text> */}
      {indicator && (
        <ActivityIndicator
          size={'large'}
          style={{position: 'absolute', right: 10, top: 10}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
  },
  leftElement: {
    alignItems: 'center',
    flex: 0, // Set the left element to take up 20% of the width
    flexDirection: 'row',
    gap: horizontalScale(10),
    height: '7%',
    fontSize: 5,
    backgroundColor: 'lightblue',
    padding: horizontalScale(10),
  },
  rightElement: {
    flex: 1, // Set the right element to take up the remaining space
    backgroundColor: 'lightgreen',
    padding: horizontalScale(10),
  },
  mcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    gap: 10,
    backgroundColor: 'white',
    padding: horizontalScale(20),
    borderRadius: horizontalScale(10),
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: horizontalScale(5),
    color: '#000',
    width: horizontalScale(150),
    padding: horizontalScale(10),
    marginBottom: verticalScale(10),
  },
  button: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  white: {
    color: 'white',
  },
  gray: {
    color: 'gray',
  },
  black: {
    color: 'black',
  },
});
