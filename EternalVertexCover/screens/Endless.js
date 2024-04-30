import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
} from 'react-native';
import {useRef, useEffect, useState} from 'react';
import RandomGraphGenerator from '../utils/RandomGraphGenerator';
import {MyModal, TouchableCircle, TouchableLine} from '../components';
import {horizontalScale, verticalScale} from '../utils/scaler';
import Timer from '../components/Timer';
import {getData, setData} from '../utils/storage';
import {giveMap} from '../utils/MainAlgoBruteForce';
import {tupleToString} from '../utils/MainAlgoBruteForceD';
import {MODES} from '../constants';
import Images from '../assets/Images';
// A JavaScript program to find size of minimum vertex
// cover using Binary Search

const maxn = 20;

// Global array to store the graph
// Note: since the array is global, all the
// elements are false initially

// Returns true if there is a possible subset
// of size 'k' that can be a vertex cover
function isCover(V, k, E, gr) {
  // Set has first 'k' bits high initially
  let set = (1 << k) - 1;

  const limit = 1 << V;

  // to mark the edges covered in each subset
  // of size 'k'
  const vis = Array.from({length: maxn}, () => new Array(maxn).fill(false));

  while (set < limit) {
    // Reset visited array for every subset
    // of vertices
    for (let i = 0; i < maxn; i++) {
      for (let j = 0; j < maxn; j++) {
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

// Returns answer to graph stored in gr[,]
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

// Inserts an edge in the graph
function insertEdge(u, v, gr) {
  gr[u][v] = true;
  gr[v][u] = true; // Undirected graph
}
export default function Endless({navigation, route}) {
  // const [gameState, setGameState] = useState();
  const [score, setScore] = useState(0);
  const [graphNode, setGraphNode] = useState(4);
  const [graphEdges, setGraphEdges] = useState(3);
  const [time, setTime] = useState(route.params.time);
  const [timeObj, setTimeObj] = useState(null);
  const [modalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState(null);
  const [guardsList, setGuardsList] = useState([]);
  const [coveredEdge, setCoveredEdge] = useState(false);
  const [numGuards, setNumGuards] = useState(route.params.numGuards);
  const solution = useRef([]);
  const mvc = useRef(0);
  const [highScore, setHighScore] = useState(0);
  const gr = useRef(
    Array.from({length: maxn}, () => new Array(maxn).fill(false)),
  );
  const samay = useRef(route.params.time);
  const [graph, setGraph] = useState(
    RandomGraphGenerator(graphNode, graphEdges),
  );
  function gameOver(text) {
    // console.log('highscore is ', highScore);
    setIsModalVisible(true);
    if (score > highScore) {
      setData('highScore' + route.params.numMoves, score);
      text += ' ,new high score!';
    }
    setModalText(text);
  }
  function showAns() {
    setGuardsList(solution.current);
  }

  function check() {
    if (route.params.numMoves === 1) {
      // return true;
      // console.log(
      //   'check values ',
      //   mvc.current,
      //   guardsList.length,
      //   guardsList,
      //   gr.current,
      //   graph[1].length,
      //   graph[1],
      // );
      if (guardsList.length === mvc.current) {
        for (let i = 0; i < graph[1].length; i++) {
          for (let j = 0; j < graph[1][i].length; j++) {
            if (
              !guardsList.includes(graph[1][i][j]) &&
              !guardsList.includes(i)
            ) {
              return false;
            }
          }
        }
        return true; //Math.random() > 0.5;
      }
      return false;
    } else {
      if (guardsList.length === 0) {
        return false;
      }
      const edgList = [];
      for (let i = 0; i < graph[1].length; i++) {
        for (let j = 0; j < graph[1][i].length; j++) {
          if (i < graph[1][i][j]) {
            edgList.push([i, graph[1][i][j]]);
          }
        }
      }
      const mp = giveMap(
        guardsList.length,
        graph[1],
        edgList,
        route.params.numMoves * 2,
      );
      console.log('map is ', mp);

      return mp.get(
        tupleToString(guardsList) + ';' + route.params.numMoves * 2,
      )[3] === 1
        ? false
        : true;
    }
  }

  function buttonPress(id) {
    if (guardsList.includes(id)) {
      setGuardsList(prev => {
        if (route.params.numMoves !== 1) {
          setNumGuards(p => {
            return p + 1;
          });
        }
        return [...prev.filter(a => a !== id)];
      });
    } else {
      if (numGuards > 0 || route.params.numMoves === 1) {
        setGuardsList(prev => {
          if (route.params.numMoves !== 1) {
            setNumGuards(p => {
              return p - 1;
            });
          }
          return [...prev, id];
        });
      }
    }
  }

  function recursor() {
    setTime(prev => {
      if (prev === 0) {
        gameOver('oopsie poopsie time over ');
        return 0;
      }
      setTimeObj(
        setTimeout(() => {
          recursor();
        }, 1000),
      );
      return prev - 1;
    });
  }
  useEffect(() => {
    recursor();
    getData('highScore' + route.params.numMoves).then(val => {
      setHighScore(val ?? 0);
    });
    let ed = 0;
    for (let i = 0; i < graph[1].length; i++) {
      for (let j = 0; j < graph[1][i].length; j++) {
        insertEdge(i, graph[1][i][j], gr.current);
        ed++;
      }
    }
    [mvc.current, solution.current] = findMinCover(
      graph[1].length,
      ed / 2,
      gr.current,
    );
  }, []);
  function challengeMe() {
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
      guardCount: guardsList.length,
      moves: route.params.numMoves * 2,
      guards: guardsList,
    };
    navigation.navigate('Level', {
      stage: obj,
      mode: MODES.AUTO_ATTACKER,
      title: 'Challenge Me',
      isChallenge: true,
    });
  }

  function donePress() {
    if (check()) {
      clearTimeout(timeObj);
      gr.current = Array.from({length: maxn}, () =>
        new Array(maxn).fill(false),
      );
      setTime(() => {
        samay.current =
          samay.current +
          (guardsList.length <= Math.ceil(mvc.current * 1.5) ? 5 : -5);
        console.log(
          'samay is ',
          guardsList.length <= Math.ceil(mvc.current * 1.5) ? 5 : -5,
        );
        return samay.current;
      });
      if (graphEdges < (graphNode * (graphNode - 1)) / 3) {
        setGraphEdges(prev => {
          setScore(prevv => {
            return Math.floor(prevv + (graphNode * 100) / guardsList.length);
          });
          setGraph(() => {
            let x = RandomGraphGenerator(graphNode, prev + 1);

            for (let i = 0; i < x[1].length; i++) {
              for (let j = 0; j < x[1][i].length; j++) {
                insertEdge(i, x[1][i][j], gr.current);
                ed++;
              }
            }
            [mvc.current, solution.current] = findMinCover(
              x[1].length,
              ed / 2,
              gr.current,
            );

            return x;
          });
          return prev + 1;
        });
      } else {
        setGraphNode(prev => {
          setScore(prevv => {
            return Math.floor(prevv + (prev * 100) / guardsList.length);
          });
          setGraph(() => {
            let x = RandomGraphGenerator(prev + 1, prev);

            for (let i = 0; i < x[1].length; i++) {
              for (let j = 0; j < x[1][i].length; j++) {
                insertEdge(i, x[1][i][j], gr.current);
                ed++;
              }
            }
            [mvc.current, solution.current] = findMinCover(
              x[1].length,
              ed / 2,
              gr.current,
            );

            return x;
          });
          setGraphEdges(prev);
          return prev + 1;
        });
      }
      recursor();
      let ed = 0;
      setGuardsList([]);
    } else {
      gameOver('oopsie poopsie wrong answer ');
    }
  }
  function giveGraph() {
    let all = [];
    // console.log(Dimensions.get('window').width);
    for (let i = 0; i < graph[1].length; i++) {
      for (let j = 0; j < graph[1][i].length; j++) {
        if (i < graph[1][i][j]) {
          all.push(
            <TouchableLine
              x1={graph[0][i][0]}
              y1={graph[0][i][1]}
              x2={graph[0][graph[1][i][j]][0]}
              y2={graph[0][graph[1][i][j]][1]}
              key={i + 'j' + j}
              yellow={
                coveredEdge &&
                (guardsList.includes(i) || guardsList.includes(graph[1][i][j]))
              }
            />,
          );
        }
      }
    }
    for (let i = 0; i < graph[0].length; i++) {
      // console.log(graph[0][i][0], graph[0][i][1]);
      all.push(
        <TouchableCircle
          cx={graph[0][i][0]}
          cy={graph[0][i][1]}
          r={horizontalScale(12)}
          key={i}
          id={i}
          isGuard={guardsList.includes(i)}
          onPress={buttonPress}
        />,
      );
    }

    return all;
  }

  return (
    <View style={{flex: 1, backgroundColor: 'grey'}}>
      <ImageBackground
        source={Images.farm}
        resizeMode="cover"
        style={styles.imageBackground}>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'black',
            left: horizontalScale(5),
          }}>
          Score:{score}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            position: 'absolute',
            right: horizontalScale(5),
            color: 'black',
          }}>
          High Score:{highScore}
        </Text>
        {route.params.numMoves !== 1 && (
          <Text
            style={{
              fontWeight: 'bold',
              position: 'absolute',
              right: horizontalScale(150),
              color: 'black',
            }}>
            Guards Left:{numGuards}
          </Text>
        )}
        <Text
          style={{
            fontWeight: 'bold',
            position: 'absolute',
            right: horizontalScale(150),
            top: horizontalScale(40),
            color: 'black',
          }}>
          Number of Moves:{route.params.numMoves}
        </Text>
        <Pressable
          onPress={() => {
            setCoveredEdge(!coveredEdge);
          }}
          style={[
            {
              position: 'absolute',
              top: '5%',
              right: horizontalScale(5),
              // width: Dimensions.get('window').width / 4,
            },
            styles.button,
            styles.buttonOpen,
          ]}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>Paint red!</Text>
        </Pressable>
        <MyModal
          modalVisible={modalVisible}
          text={modalText}
          buttonText={'Exit'}
          y={verticalScale(450)}
          x={horizontalScale(30)}
          onClickNext={() => {
            navigation.pop();
          }}
          goBack={() => {
            navigation.pop();
          }}
          showAns={route.params.numMoves === 1 ? showAns : null}
          challengeMe={route.params.numMoves > 1 ? challengeMe : null}
        />
        <View style={{left: horizontalScale(5), fontWeight: 'bold'}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Time Left: {time}
          </Text>
        </View>
        {giveGraph()}
        <Pressable
          onPress={() => {
            donePress();
          }}
          style={[
            {
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
              width: Dimensions.get('window').width / 4,
            },
            styles.button,
            styles.buttonOpen,
          ]}>
          <Text style={styles.textStyle}>Done</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    borderRadius: horizontalScale(20),
    padding: horizontalScale(10),
    elevation: horizontalScale(2),
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageBackground: {
    flex: 1,
  },
});
