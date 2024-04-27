import React from 'react';
import {View, Text, Pressable, StyleSheet, BackHandler} from 'react-native';
import {useRef, useEffect, useState, useCallback} from 'react';
import RandomGraphGenerator from '../utils/RandomGraphGenerator';
import {MyModal, Stage} from '../components';
import {horizontalScale, verticalScale} from '../utils/scaler';
import {getData, setData} from '../utils/storage';
import {MODES} from '../constants';
import {LeftArrowIcon} from '../components/icons';

function isCover(V, k, E, gr) {
  // Set has first 'k' bits high initially
  let set = (1 << k) - 1;

  const limit = 1 << V;

  // to mark the edges covered in each subset
  // of size 'k'
  const vis = Array.from({length: gr.length}, () =>
    new Array(gr.length).fill(false),
  );

  while (set < limit) {
    // Reset visited array for every subset
    // of vertices
    for (let i = 0; i < gr.length; i++) {
      for (let j = 0; j < gr.length; j++) {
        vis[i][j] = false;
      }
    }

    // set counter for number of edges covered
    // from this subset of vertices to zero
    let cnt = 0;
    let ans = [];

    // selected vertex cover is the indices
    // where 'set' has its bit high
    for (let j = 1, v = 0; j < limit; j = j << 1, v++) {
      if ((set & j) !== 0) {
        // Mark all edges emerging out of this
        // vertex visited
        ans.push(v);
        for (let co = 0; co < V; co++) {
          if (gr[v][co] && !vis[v][co]) {
            vis[v][co] = true;
            vis[co][v] = true;
            cnt++;
          }
        }
      }
    }

    // If the current subset covers all the edges
    if (cnt === E) {
      return ans;
    }

    // Generate previous combination with k bits high
    // set & -set = (1 << last bit high in set)
    const cO = set & -set;
    const rO = set + cO;
    set = (((rO ^ set) >> 2) / cO) | rO;
  }
  return false;
}
function findMinCover(n, m, gr) {
  // Binary search the answer
  let left = 1;
  let right = n;
  let ans = [];
  let lans = [];
  while (right > left) {
    let mid = (left + right) >> 1;
    ans = isCover(n, mid, m, gr);
    if (ans === false) {
      left = mid + 1;
    } else {
      lans = ans;
      right = mid;
    }
  }

  // at the end of while loop both left and
  // right will be equal,/ as when they are
  // not, the while loop won't exit the minimum
  // size vertex cover = left = right
  return [left, lans];
}
export default function StageWrap({navigation, route}) {
  const score = route.params.score;
  const graphNode = route.params.numNode;
  const graphEdges = route.params.numEdge;
  const [stageObj, setStageObj] = useState(null);
  const [time, setTime] = useState(route.params.time);
  const [modalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState(null);
  const [guardsList, setGuardsList] = useState([]);
  const solution = useRef([]);
  const [highScore, setHighScore] = useState(0);
  const [graph] = useState(RandomGraphGenerator(graphNode, graphEdges));

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
    let ed = 0;
    function insertEdge(u, v, gr) {
      gr[u][v] = true;
      gr[v][u] = true; // Undirected graph
    }
    let gr = Array.from({length: graphNode}, () =>
      new Array(graphNode).fill(false),
    );

    for (let i = 0; i < graph[1].length; i++) {
      for (let j = 0; j < graph[1][i].length; j++) {
        insertEdge(i, graph[1][i][j], gr);
        ed++;
      }
    }
    let [mvc, guardsList] = findMinCover(graphNode, graphEdges, gr);
    navigation.navigate('StageWrap', {
      ...route.params,
      time:
        route.params.time +
        (route.params.numGuards - numbGuard <= Math.ceil(mvc * 1.5) ? 5 : -5),
      numGuards: numbGuard,
      numNode:
        graphEdges >= (graphNode * graphNode) / 3 ? graphNode + 1 : graphNode,
      numEdge:
        graphEdges >= (graphNode * graphNode) / 3 ? graphNode : graphEdges + 1,
      score: Math.floor(
        score + (graphNode * 100) / (route.params.numGuards - numbGuard),
      ),
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
