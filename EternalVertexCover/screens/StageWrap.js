import React from 'react';
import {View, Text, Pressable, StyleSheet, BackHandler} from 'react-native';
import {useRef, useEffect, useState, useCallback} from 'react';
import RandomGraphGenerator from '../utils/RandomGraphGenerator';
import {MyModal, Stage} from '../components';
import {horizontalScale, verticalScale} from '../utils/scaler';
import {getData, setData} from '../utils/storage';
import {MODES} from '../constants';
import {LeftArrowIcon} from '../components/icons';

export default function StageWrap({navigation, route}) {
  const [stageObj, setStageObj] = useState(null);
  const [time, setTime] = useState(route.params.time);
  const [modalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState(null);
  const [guardsList, setGuardsList] = useState([]);
  const solution = useRef([]);
  const [highScore, setHighScore] = useState(0);
  const [graph] = useState(RandomGraphGenerator(graphNode, graphEdges));
  const score = route.params.score;
  const graphNode = route.params.numNode;
  const graphEdges = route.params.numEdge;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          style={{left: horizontalScale(10)}}
          onPress={() => {
            navigation.pop();
            navigation.pop();
          }}>
          <LeftArrowIcon />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.pop();
      navigation.pop();
      return true;
    });
    return () => handler.remove();
  }, [navigation]);

  function goAgain() {
    navigation.pop();
    navigation.navigate('StageWrap', {
      time: 30,
      numGuards: 50,
      numMoves: 2,
      numNode: 4,
      numEdge: 3,
      score: 0,
    });
  }

  function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;
    let formattedTime = '';
    if (hours > 0) {
      formattedTime += (hours < 10 ? '0' : '') + hours + ':';
    }
    if (minutes > 0) {
      formattedTime += (minutes < 10 ? '0' : '') + minutes + ':';
    }
    formattedTime += (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    return formattedTime;
  }

  function onWin(numbGuard) {
    navigation.pop();
    navigation.navigate('StageWrap', {
      ...route.params,
      time: time + 30,
      numGuards: numbGuard,
      numNode:
        graphEdges >= (graphNode * graphNode) / 3 ? graphNode + 1 : graphNode,
      numEdge:
        graphEdges >= (graphNode * graphNode) / 3 ? graphNode : graphEdges + 1,
      score: score + 1,
    });
  }

  const gameOver = useCallback(
    function gameOver(text) {
      setIsModalVisible(true);
      if (score > highScore) {
        setData('highScore', score);
        text += ' ,new high score!';
      }
      setModalText(text);
    },
    [highScore, score],
  );

  function modalGoBack() {
    navigation.pop();
    navigation.pop();
  }

  function showAns() {
    setGuardsList(solution.current);
  }
  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Score: ${score} (Time Left: ${formatTime(time)})`,
    });
  }, [time, navigation, score]);

  useEffect(() => {
    if (time <= 0) {
      gameOver('oopsie poopsie time over ');
    } else {
      const timer = setTimeout(() => {
        setTime(prevSeconds => prevSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [time, gameOver]);

  useEffect(() => {
    getData('highScore').then(val => {
      setHighScore(val ?? 0);
    });
    let str = 'digraph G {\n';
    graph[0].forEach((element, index) => {
      str +=
        index + ' ' + '[label=' + '"' + element[0] + ' ' + element[1] + '"]\n';
    });
    const edgList = [];
    for (let i = 0; i < graph[1].length; i++) {
      for (let j = 0; j < graph[1][i].length; j++) {
        if (i < graph[1][i][j]) {
          edgList.push([i, graph[1][i][j]]);
        }
      }
    }
    edgList.forEach(element => {
      str += `${element[0]} -- ${element[1]}\n`;
    });
    str += '}';
    // console.log(guards);
    const obj = {
      graph: str,
      guardCount: route.params.numGuards,
      moves: route.params.numMoves * 2,
      guards: guardsList,
      adjList: graph[1],
    };
    setStageObj(obj);
  }, [graph, guardsList, route.params.numGuards, route.params.numMoves]);

  return (
    <View style={styles.container}>
      <MyModal
        modalVisible={modalVisible}
        text={modalText}
        buttonText={'Exit'}
        y={verticalScale(450)}
        x={horizontalScale(30)}
        onClickNext={() => {
          navigation.pop();
          navigation.pop();
        }}
        goBack={() => {
          navigation.pop();
          navigation.pop();
        }}
        showAns={route.params.numMoves === 1 ? showAns : null}
      />
      {stageObj && (
        <Stage
          goAgain={goAgain}
          onWin={onWin}
          stage={stageObj}
          isEndless={true}
          mode={MODES.AUTO_ATTACKER}
          modalGoBack={modalGoBack}
          navigation={navigation}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'grey'},
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headingText: {
    fontWeight: 'bold',
    position: 'absolute',
    borderColor: 'black',
    borderWidth: horizontalScale(1),
    color: 'black',
    backgroundColor: 'white',
    fontSize: horizontalScale(16),
    width: '20%',
    borderRadius: horizontalScale(10),
    padding: horizontalScale(1),
    textAlign: 'center',
  },
});
