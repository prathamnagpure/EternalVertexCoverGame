import React from 'react';
import {View, Text, Pressable, StyleSheet, BackHandler} from 'react-native';
import {useRef, useEffect, useState, useCallback} from 'react';
import RandomGraphGenerator from '../utils/RandomGraphGenerator';
import {MyModal, Stage} from '../components';
import {horizontalScale, verticalScale} from '../utils/scaler';
import {getData, setData} from '../utils/storage';
import {MODES} from '../constants';

export default function StageWrap({navigation, route}) {
  const [stageObj, setStageObj] = useState(null);
  const [score, setScore] = useState(route.params.score);
  const [graphNode, setGraphNode] = useState(route.params.numNode);
  const [graphEdges, setGraphEdges] = useState(route.params.numEdge);
  const [time, setTime] = useState(route.params.time);
  const [modalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState(null);
  const [guardsList, setGuardsList] = useState([]);
  const [coveredEdge, setCoveredEdge] = useState(false);
  const solution = useRef([]);
  const [highScore, setHighScore] = useState(0);
  const [graph, setGraph] = useState(
    RandomGraphGenerator(graphNode, graphEdges),
  );

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      navigation.goBack();
      return true;
    });
    return () => handler.remove();
  }, [navigation]);

  function goAgain() {
    navigation.goBack();
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
    navigation.goBack();
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

  function showAns() {
    setGuardsList(solution.current);
  }
  useEffect(() => {
    navigation.setOptions({headerTitle: time});
  }, [time, navigation]);

  useEffect(() => {
    if (time <= 0) {
      gameOver('oopsie poopsie time over ');
    }
    const timer = setTimeout(() => {
      setTime(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
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
    <View style={{flex: 1, backgroundColor: 'grey'}}>
      <Pressable
        onPress={() => {
          setCoveredEdge(!coveredEdge);
        }}
        style={[
          {
            position: 'absolute',
            top: '5%',
            right: 0,
            // width: Dimensions.get('window').width / 4,
          },
          styles.button,
          styles.buttonOpen,
        ]}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>
          Higlight covered!
        </Text>
      </Pressable>
      <MyModal
        modalVisible={modalVisible}
        text={modalText}
        buttonText={'Exit'}
        y={verticalScale(450)}
        x={horizontalScale(30)}
        onClickNext={() => {
          navigation.goBack();
          navigation.goBack();
        }}
        goBack={() => {
          navigation.goBack();
          navigation.goBack();
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
        />
      )}
      <Text
        numberOfLines={1}
        allowFontScaling={true}
        style={{
          position: 'absolute',
          right: 0,
          fontWeight: 'bold',
          fontSize: 16,
          color: 'red',
          backgroundColor: 'white',
        }}>
        Time: {formatTime(time)}
      </Text>
      <Text
        style={{
          fontWeight: 'bold',
          position: 'absolute',
          color: 'black',
          backgroundColor: 'white',
          fontSize: 16,
        }}>
        Score:{score}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
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
});
