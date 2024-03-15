import {React, useState, useEffect, useRef, useCallback} from 'react';
import Images from '../assets/Images';
import {giveMap as giveMapA, tupleToString} from '../utils/MainAlgoBruteForce';
import {giveMap as giveMapD} from '../utils/MainAlgoBruteForceD';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  useWindowDimensions,
  Alert,
} from 'react-native';
import {TouchableCircle, TouchableLine, Poop, Guard, TutorialStep} from '.';
import parse from 'dotparser';
import Sound from 'react-native-sound';
import {
  Gesture,
  GestureHandlerRootView,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {MODES} from '../constants';

const turns = {
  defenderFirst: 1,
  defenderLater: 2,
  attacker: 3,
};
const winner = {
  defender: 1,
  attacker: 2,
};

export default function Stage({
  navigation,
  stage,
  mode,
  isAttackerTutorial,
  isDefenderTutorial,
}) {
  const [atTutStage, setAtTutStage] = useState(isAttackerTutorial ? 1 : 6);
  const [tutVisible, setTutVisible] = useState(
    isAttackerTutorial || isDefenderTutorial ? true : false,
  );
  console.log({tutVisible});
  const [pigImage, setPigImage] = useState(Images.naugtypig);
  const [poop, setPoop] = useState(false);
  const [guardCount, setGuardCount] = useState(stage.guardCount);
  const [guardStateMap, setGuardStateMap] = useState(new Map());
  const [turn, setTurn] = useState(turns.defenderFirst);
  const [isLoading, setIsLoading] = useState(true);
  const {height, width} = useWindowDimensions();
  const [gameWinner, setGameWinner] = useState(null);
  const [warning, setWarning] = useState('');
  const [nodeStateMap, setNodeStateMap] = useState(new Map());
  const [edgeStateMap, setEdgeStateMap] = useState(new Map());
  const [arrowX, setArrowX] = useState(0);
  const [arrowY, setArrowY] = useState(0);

  const showAnimation = useRef({value: false});
  const nodeIdToGuardIdMap = useRef(new Map());
  const guardIdToNodeIdMap = useRef(new Map());
  const adjList = useRef(null);
  const edgeList = useRef([]);
  const moveMap = useRef(null);
  const momentoes = useRef([]);
  const currentMomentoIndex = useRef(0);
  const maxMomentoIndex = useRef(0);
  const attackedEdge = useRef(null);
  const guards = useRef([]);
  const moves = useRef(stage.moves);
  const selected = useRef(null);

  const pressed = useSharedValue(false);
  const offset = useSharedValue(0);
  const offsety = useSharedValue(0);
  const inX = useSharedValue(100);
  const inY = useSharedValue(100);
  const poopX = useSharedValue(100);
  const poopY = useSharedValue(100);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const poopOpacity = useSharedValue(1);
  const butwidth = useSharedValue(100);

  const sound = new Sound('fart.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      return;
    }
    // loaded successfully
    // Play the sound with an onEnd callback
  });
  sound.setVolume(1);

  // const funcPlayForever = () => {
  //   console.log('playing sound bgm');
  //   mainBGM.play(success => {
  //     if (success) {
  //       funcPlayForever();
  //     }
  //   });
  // };
  // funcPlayForever();
  //
  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange(event => {
      offset.value = event.translationX;
      offsety.value = event.translationY;
    })
    .onFinalize(() => {
      pressed.value = false;
      inX.value += offset.value;
      inY.value += offsety.value;
      offset.value = 0;
      offsety.value = 0;
    });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: offset.value},
      {translateY: offsety.value},
      {scale: withTiming(pressed.value ? 1.2 : 1)},
    ],
    left: inX.value,
    top: inY.value,
    width: butwidth.value,
    height: butwidth.value,
  }));

  const animatedStylesPoop = useAnimatedStyle(() => {
    return {
      opacity: poopOpacity.value,
      left: poopX.value,
      top: poopY.value,
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  const animatedStylesFire = useAnimatedStyle(() => ({
    opacity: opacity.value,
    left: poopX.value - 50,
    top: poopY.value,
  }));

  const atNextFunc = () => {
    switch (atTutStage) {
      case 1:
        setAtTutStage(2);
        break;
      case 2:
        setTutVisible(false);
        break;
      case 3:
        setTutVisible(false);
        break;
      case 4:
        setTutVisible(false);
        break;
      case 5:
        setTutVisible(false);
        setAtTutStage(4);
        break;
      case 6:
        setAtTutStage(7);
        break;
      case 7:
        setAtTutStage(8);
        break;
      case 8:
        setAtTutStage(9);
        setArrowX(nodeStateMap.get('0').cx);
        setArrowY(nodeStateMap.get('0').cy);
        break;
      case 9:
        setTutVisible(false);
        break;
      case 10:
        setTutVisible(false);
        break;
      case 11:
        setTutVisible(false);
        break;
      case 12:
        setAtTutStage(13);
        break;
      case 13:
        setTutVisible(false);
        break;
      case 14:
        setTutVisible(false);
        break;
    }
  };

  useEffect(() => {
    if (showAnimation.current.value) {
      showAnimation.current.value = false;
      poopOpacity.value = 1;
      opacity.value = withTiming(1, {duration: 2000}, () => {
        opacity.value = withTiming(0, {duration: 1000});
      });

      const {x1, x2, y1, y2} = edgeStateMap.get(attackedEdge.current);
      const newX = (x1 + x2) / 2 - 35;
      const newY = (y1 + y2) / 2;
      const config = {duration: 3000};
      poopX.value = inX.value;
      poopY.value = inY.value;
      poopX.value = withTiming(newX, config);
      poopY.value = withTiming(newY, config);
      console.log({a: newX, b: newY});
      translateX.value = withTiming(newX, config);
      translateY.value = withTiming(newY, config);

      rotation.value = withTiming(rotation.value + 720, {duration: 3000});
      butwidth.value = withSpring(
        butwidth.value + 100,
        {duration: 1000},
        () => {
          butwidth.value = withSpring(butwidth.value - 100, {duration: 1000});
        },
      );
    }
  }, [
    butwidth,
    opacity,
    rotation,
    translateX,
    translateY,
    poop,
    pigImage,
    edgeStateMap,
    inX.value,
    inY.value,
    poopX,
    poopY,
    poopOpacity,
  ]);

  function pooperPrakat() {
    setPigImage(Images.pigpoop);
    showAnimation.current.value = true;
    sound.play();
    setPoop(true);
    // set shared location
    //setpoop fire angle
    // set pig naugty
    //
  }

  // Initializer
  useEffect(() => {
    const status = construct();
    if (status === 'ok') {
      if (mode === MODES.AUTO_DEFENDER) {
        stage.guards.sort((a, b) => a - b);
        moveMap.current = new Map(Object.entries(stage.map));
        setTurn(turns.attacker);
      } else if (mode === MODES.AUTO_ATTACKER) {
        moveMap.current = new Map(Object.entries(stage.map));
      }
      setIsLoading(false);
    } else if (status === 'error') {
      setWarning('An error occurred');
      setIsLoading(false);
    }
  }, [construct, mode, stage.guards, stage.map]);

  const saveMomento = useCallback(
    function (calledByUndo = false) {
      const momento = {
        moves: moves.current,
        attackedEdge: attackedEdge.current,
        turn,
        gameWinner,
        guardStateMap: new Map(guardStateMap),
        nodeStateMap: new Map(nodeStateMap),
        edgeStateMap: new Map(edgeStateMap),
        poop,
        tutVisible,
      };
      momentoes.current.slice(0, currentMomentoIndex.current);
      momentoes.current.push(momento);
      if (!calledByUndo) {
        maxMomentoIndex.current = currentMomentoIndex.current + 1;
      }
      currentMomentoIndex.current = maxMomentoIndex.current;
    },
    [
      edgeStateMap,
      gameWinner,
      nodeStateMap,
      turn,
      guardStateMap,
      poop,
      tutVisible,
    ],
  );
  function undo() {
    if (currentMomentoIndex.current === 0) {
      return;
    }
    if (currentMomentoIndex.current === maxMomentoIndex.current) {
      saveMomento(true);
    }
    currentMomentoIndex.current--;
    applyMomento(momentoes.current[currentMomentoIndex.current]);
  }
  function isHumanPlaying() {
    return (
      (mode === MODES.AUTO_DEFENDER && turn === turns.attacker) ||
      (mode === MODES.AUTO_ATTACKER &&
        (turn === turns.defenderFirst || turn === turns.defenderLater)) ||
      !mode
    );
  }
  function redo() {
    if (currentMomentoIndex.current === maxMomentoIndex.current) {
      return;
    }
    currentMomentoIndex.current++;
    if (isHumanPlaying()) {
      applyMomento(currentMomentoIndex.current);
    }
  }
  function applyMomento(momento) {
    setNodeStateMap(momento.nodeStateMap);
    setGuardStateMap(momento.guardStateMap);
    setEdgeStateMap(momento.edgeStateMap);
    attackedEdge.current = momento.attackedEdge;
    moves.current = momento.moves;
    setTurn(momento.turn);
    if (momento.turn === turns.attacker) {
      setPigImage(Images.naugtypig);
    }
    setGameWinner(momento.gameWinner);
    setPoop(momento.poop);
    setTutVisible(momento.tutVisible);
  }
  function renderNodes() {
    return [...nodeStateMap.keys()]
      .map(key => nodeStateMap.get(key))
      .map(value => {
        return (
          <TouchableCircle
            key={value.id}
            r={30}
            onPress={showGuard}
            {...value}
          />
        );
      });
  }
  function renderEdges() {
    return [...edgeStateMap.keys()]
      .map(key => [key, edgeStateMap.get(key)])
      .map(element => {
        const [key, value] = element;
        return (
          <TouchableLine
            key={key}
            thickness={17}
            onPress={onEdgePress}
            {...value}
          />
        );
      });
  }
  function onGuardPress(guardId) {
    showGuard(guardIdToNodeIdMap.current.get(guardId));
  }
  function renderGuards() {
    return [...guardStateMap.keys()]
      .map(key => [key, guardStateMap.get(key)])
      .map(element => {
        const [key, value] = element;
        return (
          <Guard
            {...value}
            width={70}
            height={70}
            key={key + ' Guard'}
            id={key}
            animateRef={animate => {
              value.animateRef = animate;
            }}
            onPress={onGuardPress}
          />
        );
      });
  }
  function resetNodes() {
    const newNodeStateMap = new Map();
    [...nodeStateMap.keys()].forEach(key => {
      const value = nodeStateMap.get(key);
      newNodeStateMap.set(key, {
        ...value,
        isGuardPresent: false,
        isSelected: false,
      });
    });
    setNodeStateMap(newNodeStateMap);
  }
  function resetEdges() {
    const newEdgeStateMap = new Map();
    [...edgeStateMap.keys()].forEach(key => {
      const value = edgeStateMap.get(key);
      value.moveGuard1 = false;
      value.moveGuard2 = false;
      value.isAttacked = false;
      newEdgeStateMap.set(key, value);
    });
    setEdgeStateMap(newEdgeStateMap);
  }
  function restartGame() {
    currentMomentoIndex.current = 0;
    maxMomentoIndex.current = 0;
    momentoes.current = [];
    attackedEdge.current = null;
    moves.current = stage.moves;
    resetNodes();
    resetEdges();
    if (mode === MODES.AUTO_DEFENDER) {
      const newNodeStateMap = new Map(nodeStateMap);
      [...nodeStateMap.keys()].forEach(key => {
        const value = nodeStateMap.get(key);
        if (stage.guards.includes(parseInt(key, 10))) {
          newNodeStateMap.set(key, {...value, isGuardPresent: true});
        }
      });
      setTurn(turns.attacker);
      setPigImage(Images.naugtypig);
      setGameWinner(null);
      setNodeStateMap(newNodeStateMap);
    } else {
      setTurn(turns.defenderFirst);
      setGameWinner(null);
      setGuardCount(stage.guardCount);
    }
  }
  function onButtonPress() {
    if (gameWinner) {
      restartGame();
    } else {
      changeTurn();
    }
  }
  function isGuardOnEdge(edgeId) {
    const [node1, node2] = edgeId.split(';');
    return (
      nodeStateMap.get(node1).isGuardPresent ||
      nodeStateMap.get(node2).isGuardPresent
    );
  }
  function playAutoAttacker(isCalledByRedo) {
    if (moves.current === 0) {
      setGameWinner(prev => (prev ? prev : winner.defender));
      return;
    }
    guards.current = [];
    const newNodeStateMap = new Map(nodeStateMap);
    newNodeStateMap.forEach(nodeState => {
      if (nodeState.isGuardPresent) {
        guards.current.push(parseInt(nodeState.id, 10));
      }
    });
    console.log('here', moveMap.current);
    let toAttack = moveMap.current.get(
      tupleToString(guards.current) + ';' + moves.current,
    )[0];
    attackedEdge.current =
      edgeList.current[toAttack][0] + ';' + edgeList.current[toAttack][1];
    onEdgePress(attackedEdge.current, turns.attacker);
    moves.current--;
    checkAttack(isCalledByRedo);
    pooperPrakat();
  }
  function playAutoDefender() {
    --moves.current;
    if (moves.current <= 0) {
      setGameWinner(prev => (prev ? prev : winner.defender));
      return;
    }
    guards.current = [];
    const newNodeStateMap = new Map(nodeStateMap);
    newNodeStateMap.forEach(nodeState => {
      if (nodeState.isGuardPresent) {
        guards.current.push(parseInt(nodeState.id, 10));
      }
    });
    guards.current.sort((a, b) => a - b);
    const [node1, node2] = attackedEdge.current.split(';');
    let edgeIndex = -1;
    edgeList.current.forEach((value, index) => {
      if (String(value[0]) === node1 && String(value[1]) === node2) {
        edgeIndex = index;
      }
    });
    const nextMove = moveMap.current.get(
      tupleToString(guards.current) + ';' + edgeIndex + ';' + moves.current,
    );
    console.log(
      'this val',
      tupleToString(guards.current) + ';' + edgeIndex + ';' + moves.current,
    );
    const newPos = nextMove[0];
    const changes = nextMove[nextMove.length - 1];
    const newEdgeStateMap = new Map(edgeStateMap);
    newPos.forEach((value, index) => {
      const nodeId1 = String(guards.current[changes[index]]);
      const nodeId2 = String(value);
      showGuardMovement(newEdgeStateMap, nodeId1, nodeId2);
    });
    setEdgeStateMap(newEdgeStateMap);
  }
  function checkAttack(isCalledByRedo = false) {
    if (!attackedEdge.current) {
      setWarning('You have to attack an edge');
      return false;
    } else {
      // Saving momento.
      if (mode !== MODES.AUTO_ATTACKER && !isCalledByRedo) {
        saveMomento();
      }
      if (isGuardOnEdge(attackedEdge.current)) {
        if (isAttackerTutorial && atTutStage === 4) {
          setTutVisible(true);
          setAtTutStage(5);
        }
        setTurn(turns.defenderLater);
      } else {
        setGameWinner(prev => (prev ? prev : winner.attacker));
      }
    }
    return true;
  }
  function changeTurn(isCalledByRedo = false) {
    if (isLoading) {
      return;
    }
    setWarning('');
    if (turn === turns.defenderFirst) {
      if (guardCount === 0) {
        // Saving momento.
        if (mode !== MODES.AUTO_DEFENDER && !isCalledByRedo) {
          saveMomento();
        }
        if (mode === MODES.AUTO_ATTACKER) {
          playAutoAttacker(isCalledByRedo);
        } else {
          setTurn(turns.attacker);
          setPigImage(Images.naugtypig);
        }
      } else {
        setWarning('Guards left should be 0');
      }
      if (isDefenderTutorial) {
        setTutVisible(true);
        setAtTutStage(11);
      }
    } else if (turn === turns.attacker) {
      if (checkAttack(isCalledByRedo)) {
        pooperPrakat();
        if (mode === MODES.AUTO_DEFENDER) {
          playAutoDefender();
          if (isAttackerTutorial) {
            if (atTutStage === 2) {
              setAtTutStage(3);
              setTutVisible(true);
            }
            if (atTutStage === 4) {
              console.log('reached in at 4');
            }
          }
        }
      }
    } /* turn === turns.defenderLater */ else {
      if (isAttackerTutorial) {
        setAtTutStage(4);
        setTutVisible(true);
      }
      const nodeGuardCounter = new Map();
      const newNodeStateMap = new Map(nodeStateMap);
      [...newNodeStateMap.keys()].forEach(nodeId => {
        nodeGuardCounter.set(
          nodeId,
          newNodeStateMap.get(nodeId).isGuardPresent ? 1 : 0,
        );
      });
      const newEdgeStateMap = new Map(edgeStateMap);
      newEdgeStateMap.forEach((edgeState, edgeId) => {
        let [node1, node2] = edgeId.split(';');
        if (edgeState.moveGuard1) {
          nodeGuardCounter.set(node1, nodeGuardCounter.get(node1) - 1);
          nodeGuardCounter.set(node2, nodeGuardCounter.get(node2) + 1);
        }
        if (edgeState.moveGuard2) {
          nodeGuardCounter.set(node1, nodeGuardCounter.get(node1) + 1);
          nodeGuardCounter.set(node2, nodeGuardCounter.get(node2) - 1);
        }
      });
      let good = true;
      nodeGuardCounter.forEach(value => {
        if (value < 0 || value > 1) {
          good = false;
        }
      });
      if (good) {
        // Saving momento.
        if (mode !== MODES.AUTO_DEFENDER && !isCalledByRedo) {
          saveMomento();
        }
        let wasCovered = false;
        const guardExistsSet = new Set();
        const moveGuard = (edgeId, nodeId1, nodeId2) => {
          if (edgeId === attackedEdge.current) {
            wasCovered = true;
          }
          const {cx, cy} = nodeStateMap.get(nodeId2);
          const guardIds = nodeIdToGuardIdMap.current.get(nodeId1);
          const [guardId] = guardIds;
          const guardState = guardStateMap.get(guardId);
          if (guardIds.length === 1) {
            nodeIdToGuardIdMap.current.delete(nodeId1);
          } else {
            nodeIdToGuardIdMap.current.get(nodeId1).shift();
          }
          guardIdToNodeIdMap.current.delete(guardId);
          if (nodeIdToGuardIdMap.current.has(nodeId2)) {
            nodeIdToGuardIdMap.current.get(nodeId2).push(guardId);
          } else {
            nodeIdToGuardIdMap.current.set(nodeId2, [guardId]);
          }
          guardIdToNodeIdMap.current.set(guardId, nodeId2);
          guardState.animateRef(cx, cy);
          if (!guardExistsSet.has(nodeId1)) {
            const nodeState = newNodeStateMap.get(nodeId1);
            nodeState.isGuardPresent = false;
            newNodeStateMap.set(nodeId1, nodeState);
          }
          const nodeState = newNodeStateMap.get(nodeId2);
          nodeState.isGuardPresent = true;
          newNodeStateMap.set(nodeId2, nodeState);
          guardExistsSet.add(nodeId2);
        };
        newEdgeStateMap.forEach((edgeState, edgeId) => {
          const [node1, node2] = edgeId.split(';');
          if (edgeState.moveGuard1) {
            moveGuard(edgeId, node1, node2);
          }
          if (edgeState.moveGuard2) {
            moveGuard(edgeId, node2, node1);
          }
        });
        setGuardStateMap(new Map(guardStateMap));
        setNodeStateMap(newNodeStateMap);
        setEdgeStateMap(newEdgeStateMap);
        const [attackedNode1, attackedNode2] = attackedEdge.current.split(';');
        if (
          (!nodeStateMap.get(attackedNode1).isGuardPresent &&
            !nodeStateMap.get(attackedNode2).isGuardPresent) ||
          !wasCovered
        ) {
          setGameWinner(prev => (prev ? prev : winner.attacker));
        } else {
          setTimeout(() => {
            setPoop(false);
          }, 2500);
          resetEdges();
          attackedEdge.current = null;
          if (mode === MODES.AUTO_ATTACKER) {
            moves.current--;
            setTimeout(playAutoAttacker, 5000);
          } else if (mode === MODES.AUTO_DEFENDER) {
            moves.current--;
          }
          setTurn(turns.attacker);
          setPigImage(Images.naugtypig);
        }
        console.log({isDefenderTutorial, atTutStage});
        if (isDefenderTutorial && atTutStage === 13) {
          setTutVisible(true);
          setAtTutStage(14);
        }
      } else {
        setWarning('Invalid move, try again.');
      }
    }
  }
  const onEdgePress = useCallback(
    (edgeId, currTurn = null) => {
      if (isLoading) {
        return;
      }
      currTurn = currTurn === null ? turn : currTurn;
      const newEdgeStateMap = new Map(edgeStateMap);
      if (currTurn === turns.attacker) {
        if (attackedEdge.current) {
          const prevState = newEdgeStateMap.get(attackedEdge.current);
          newEdgeStateMap.set(attackedEdge.current, {
            ...prevState,
            isAttacked: false,
          });
        }
        attackedEdge.current = edgeId;
        const prevState = newEdgeStateMap.get(edgeId);
        newEdgeStateMap.set(edgeId, {...prevState, isAttacked: true});
        setEdgeStateMap(newEdgeStateMap);
      } else if (
        currTurn === turns.defenderLater &&
        mode !== MODES.AUTO_DEFENDER
      ) {
        const prevState = newEdgeStateMap.get(edgeId);
        newEdgeStateMap.set(edgeId, {
          ...prevState,
          moveGuard1: false,
          moveGuard2: false,
        });
        setEdgeStateMap(newEdgeStateMap);
      }
    },
    [edgeStateMap, isLoading, mode, turn],
  );
  function showGuardMovement(currEdgeStateMap, fromNodeId, toNodeId) {
    if (fromNodeId === toNodeId) {
      return;
    }
    let edgeId = fromNodeId + ';' + toNodeId;
    let edgeState = currEdgeStateMap.get(edgeId);
    if (currEdgeStateMap.has(edgeId)) {
      edgeState.moveGuard1 = true;
    } else {
      edgeId = toNodeId + ';' + fromNodeId;
      edgeState = edgeStateMap.get(edgeId);
      edgeState.moveGuard2 = true;
    }
    currEdgeStateMap.set(edgeId, edgeState);
  }
  function showGuard(nodeId, bySystem = false, currentTurn = null) {
    if (!bySystem && (isLoading || mode === MODES.AUTO_DEFENDER)) {
      return;
    }
    if (isDefenderTutorial && atTutStage === 9 && nodeId !== '1') {
      return;
    }
    if (isDefenderTutorial && nodeId === '1') {
      setTutVisible(true);
      setAtTutStage(10);
    }
    if (isDefenderTutorial && atTutStage === 11) {
      const [i1, i2] = attackedEdge.current.split(';');
      if (i1 !== nodeId && i2 !== nodeId) {
        return;
      }
    }
    if (isDefenderTutorial && atTutStage === 11 && selected.current) {
      setTutVisible(true);
      setAtTutStage(12);
    }
    currentTurn = currentTurn === null ? turn : currentTurn;
    const newNodeStateMap = new Map(nodeStateMap);
    console.log({nodeId});
    const nodeState = newNodeStateMap.get(nodeId);
    const newGuardStates = new Map(guardStateMap);
    if (currentTurn === turns.defenderFirst) {
      if (nodeIdToGuardIdMap.current.has(nodeId)) {
        setGuardCount(prev => ++prev);
        const [guardId] = nodeIdToGuardIdMap.current.get(nodeId);
        newGuardStates.delete(guardId);
        nodeIdToGuardIdMap.current.delete(nodeId);
        guardIdToNodeIdMap.current.delete(guardId);
        newNodeStateMap.set(nodeId, {...nodeState, isGuardPresent: false});
      } else {
        setGuardCount(prev => --prev);
        const {cx, cy} = nodeStateMap.get(nodeId);
        newGuardStates.set(nodeId, {cy, cx});
        nodeIdToGuardIdMap.current.set(nodeId, [nodeId]);
        guardIdToNodeIdMap.current.set(nodeId, nodeId);
        newNodeStateMap.set(nodeId, {...nodeState, isGuardPresent: true});
      }
      setNodeStateMap(newNodeStateMap);
      setGuardStateMap(newGuardStates);
    } else if (currentTurn === turns.defenderLater) {
      if (selected.current) {
        if (adjList.current.get(selected.current).includes(nodeId)) {
          const newEdgeStateMap = new Map(edgeStateMap);
          showGuardMovement(newEdgeStateMap, selected.current, nodeId);
          setEdgeStateMap(newEdgeStateMap);
        }
        const selectedNodeState = newNodeStateMap.get(selected.current);
        newNodeStateMap.set(selected.current, {
          ...selectedNodeState,
          isSelected: false,
        });
        selected.current = null;
        setNodeStateMap(newNodeStateMap);
      } else if (nodeState.isGuardPresent) {
        newNodeStateMap.set(nodeId, {...nodeState, isSelected: true});
        selected.current = nodeId;
        setNodeStateMap(newNodeStateMap);
      }
    }
  }

  let buttonTitle = 'Done';
  let headingStyle = styles.heading;
  let headingText = '';
  if (gameWinner) {
    buttonTitle = 'Restart';
    let winText =
      gameWinner === winner.attacker ? 'Attacker Won' : 'Defender Won';
    let textColor = {color: 'white'};
    if (mode) {
      const isAutoAttacker = mode === MODES.AUTO_ATTACKER;
      const isWinnerAttacker = gameWinner === winner.attacker;
      winText = isAutoAttacker === isWinnerAttacker ? 'You Lose' : 'You Won';
      textColor =
        isAutoAttacker === isWinnerAttacker ? styles.red : styles.green;
    }
    headingStyle = [styles.heading, textColor];
    headingText = `${winText}!`;
  } else if (isLoading) {
    headingText = 'Loading... Please Wait';
  } else {
    switch (mode) {
      case MODES.AUTO_ATTACKER:
        switch (turn) {
          case turns.attacker:
            headingText = "Attacker's Turn";
            break;
          case turns.defenderLater:
            headingText = `Your turn | Turns Left: ${(moves.current + 1) / 2}`;
            break;
          case turns.defenderFirst:
            headingText = `Guards Left: ${guardCount}`;
            headingStyle = [
              styles.heading,
              {
                color: guardCount < 0 ? 'red' : 'white',
              },
            ];
            break;
          default:
        }
        break;
      case MODES.AUTO_DEFENDER:
        headingText =
          turn === turns.attacker
            ? `Your turn | Turns Left: ${(moves.current + 1) / 2}`
            : "Defender's Turn";
        break;
      default:
        switch (turn) {
          case turns.attacker:
            headingText = "Attacker's Turn";
            break;
          case turns.defenderLater:
            headingText = "Defenders's turn";
            break;
          default:
            headingText = `Guards Left: ${guardCount}`;
            headingStyle = [
              styles.heading,
              {
                color: guardCount < 0 ? 'red' : 'white',
              },
            ];
        }
    }
    console.log('now', moves.current);
  }
  const construct = useCallback(
    function construct() {
      let ast = null;
      try {
        ast = parse(stage.graph);
      } catch {
        return 'error';
      }
      if (!ast) {
        return 'error';
      }
      adjList.current = new Map();
      edgeList.current = [];
      const newNodeStateMap = new Map();
      const newEdgeStateMap = new Map();
      const newGuardStateMap = new Map();
      const children = ast[0].children;
      let maxX = 0,
        maxY = 0;
      let adjListForMap = [];
      for (const element of children) {
        if (element.type === 'node_stmt') {
          const [x, y] = element.attr_list[0].eq.split(' ');
          maxX = Math.max(x, maxX);
          maxY = Math.max(y, maxY);
          const id = String(element.node_id.id);
          adjList.current.set(id, []);
          adjListForMap.push([]);
          let isGuardPresent = false;
          if (
            mode === MODES.AUTO_DEFENDER &&
            stage.guards.includes(parseInt(id, 10))
          ) {
            isGuardPresent = true;
            const guardState = {
              cy: parseFloat(y),
              cx: parseFloat(x),
              id: String(id),
              shouldAnimate: false,
            };
            newGuardStateMap.set(String(id), guardState);
            nodeIdToGuardIdMap.current.set(id, [id]);
            guardIdToNodeIdMap.current.set(id, id);
          }
          newNodeStateMap.set(id, {
            cx: parseFloat(x),
            cy: parseFloat(y),
            id: String(element.node_id.id),
            isGuardPresent,
          });
        } /* edge */ else {
          const edgeId =
            String(element.edge_list[0].id) +
            ';' +
            String(element.edge_list[1].id);
          const node1 = newNodeStateMap.get(String(element.edge_list[0].id));
          const node2 = newNodeStateMap.get(String(element.edge_list[1].id));
          newEdgeStateMap.set(edgeId, {
            id: edgeId,
            x1: node1.cx,
            y1: node1.cy,
            x2: node2.cx,
            y2: node2.cy,
            isAttacked: false,
            moveGuard1: false,
            moveGuard2: false,
          });
          if (isAutomatic(mode)) {
            edgeList.current.push([
              element.edge_list[0].id,
              element.edge_list[1].id,
            ]);
          }
          adjList.current
            .get(String(element.edge_list[0].id))
            .push(String(element.edge_list[1].id));
          adjList.current
            .get(String(element.edge_list[1].id))
            .push(String(element.edge_list[0].id));
        }
      }
      let returnVal = 'ok';
      if (!stage.map) {
        if (mode === MODES.AUTO_ATTACKER) {
          returnVal = 'loading';
          setTimeout(() => {
            stage.map = Object.fromEntries(
              giveMapA(
                stage.guardCount,
                adjListForMap,
                edgeList.current,
                stage.moves,
              ),
            );
            moveMap.current = new Map(Object.entries(stage.map));
            setIsLoading(false);
          }, 0);
        } else if (mode === MODES.AUTO_DEFENDER) {
          stage.guards.sort((a, b) => a - b);
          returnVal = 'loading';
          setTimeout(() => {
            stage.map = Object.fromEntries(
              giveMapD(
                stage.guardCount,
                stage.guards,
                adjListForMap,
                edgeList.current,
                stage.moves - 1,
              ),
            );
            console.log('I am here', stage.map);
            moveMap.current = new Map(Object.entries(stage.map));
            setIsLoading(false);
            setTurn(turns.attacker);
          });
        }
      }
      function resize(x, y) {
        return [(x / maxX) * width * 0.85, (y / maxY) * height * 0.7];
      }
      newNodeStateMap.forEach(value => {
        [value.cx, value.cy] = resize(value.cx, value.cy);
      });
      newEdgeStateMap.forEach(value => {
        [value.x1, value.y1] = resize(value.x1, value.y1);
        [value.x2, value.y2] = resize(value.x2, value.y2);
      });
      newGuardStateMap.forEach(value => {
        [value.cx, value.cy] = resize(value.cx, value.cy);
      });

      setNodeStateMap(newNodeStateMap);
      setEdgeStateMap(newEdgeStateMap);
      setGuardStateMap(newGuardStateMap);
      return returnVal;
    },
    [mode, height, width, stage],
  );

  const undoButtonStyle = [
    styles.undo,
    {display: currentMomentoIndex.current > 0 ? 'flex' : 'none'},
  ];
  const redoButtonStyle = [
    styles.redo,
    {
      display:
        currentMomentoIndex.current < maxMomentoIndex.current ? 'flex' : 'none',
    },
  ];
  let angle = 0;
  if (attackedEdge.current) {
    const {x1, x2, y1, y2} = edgeStateMap.get(attackedEdge.current);
    angle = ((y1 + y2) / 2 - inY.value) / ((x1 + x2) / 2 - inX.value);
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
        source={Images.farm}
        resizeMode="cover"
        style={styles.imageBackground}>
        <Text
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          style={[headingStyle]}>
          {headingText}
        </Text>
        <Pressable onPressIn={undo} style={undoButtonStyle}>
          <Text>Undo</Text>
        </Pressable>
        <Pressable onPressIn={redo} style={redoButtonStyle}>
          <Text>Redo</Text>
        </Pressable>
        <View style={styles.container}>
          {renderEdges()}
          {renderNodes()}
          {renderGuards()}
        </View>
        <Text style={styles.warning}>{warning}</Text>
        <Pressable onPressIn={onButtonPress} style={styles.button}>
          <Text>{buttonTitle}</Text>
        </Pressable>
        <GestureDetector gesture={pan}>
          <>
            <Animated.Image
              source={pigImage}
              style={[styles.pig, animatedStyles]}
            />
            {pigImage !== Images.naugtypig && (
              <Animated.View
                style={[
                  {
                    width: 100,
                    height: 100,
                    position: 'absolute',
                  },
                  animatedStylesFire,
                ]}>
                <Image
                  source={Images.fire}
                  style={{
                    width: 100,
                    height: 100,
                    transform: [
                      {rotate: `-${(2 * Math.PI) / 2 + Math.atan(angle)}rad`},
                    ],
                  }}
                />
              </Animated.View>
            )}
            {poop && (
              <>
                <Poop {...{poopX, poopY, animatedStylesPoop}} key={'Poop'} />
              </>
            )}
          </>
        </GestureDetector>
        {tutVisible && (
          <TutorialStep
            tutorialState={atTutStage}
            arrowX={arrowX}
            arrowY={arrowY}
            pigX={inX.value}
            j
            pigY={inY.value}
            nextFunction={() => {
              atNextFunc();
            }}
            goBack={() => {
              navigation.goBack();
            }}
          />
        )}
      </ImageBackground>
    </GestureHandlerRootView>
  );
}
function isAutomatic(mode) {
  return mode === MODES.AUTO_ATTACKER || mode === MODES.AUTO_DEFENDER;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 30,
    // backgroundColor: 'yellow',
  },
  imageBackground: {
    flex: 1,
  },
  heading: {
    padding: 5,
    alignSelf: 'center',
    fontSize: 20,
    top: 5,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
    height: 33,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
  button: {
    backgroundColor: 'grey',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 600,
    width: '100%',
    alignSelf: 'center',
  },
  warning: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 500,
    color: 'red',
    fontSize: 15,
    alignSelf: 'center',
  },
  undo: {
    backgroundColor: 'grey',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 550,
    width: '20%',
    left: 50,
    alignSelf: 'center',
  },
  redo: {
    backgroundColor: 'grey',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 550,
    right: 50,
    width: '20%',
    alignSelf: 'center',
  },
  pig: {
    position: 'absolute',
    top: 100,
    left: 100,
  },
});
