import {
  React,
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import Images from '../assets/Images';
import {giveMap as giveMapA, tupleToString} from '../utils/MainAlgoBruteForce';
import {giveMap as giveMapD} from '../utils/MainAlgoBruteForceD';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Text,
  ImageBackground,
  useWindowDimensions,
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
import {horizontalScale, verticalScale} from '../utils/scaler';
import {AnimationSpeedContext, InGameVolumeContext} from '../contexts';

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
  goNextStage,
  goAgain,
  onWin,
}) {
  const {animationSpeed} = useContext(AnimationSpeedContext);
  const poopDuration = animationSpeed * 300;
  const cleanDuration = animationSpeed * 300;
  const {inGameVolume} = useContext(InGameVolumeContext);

  const [atTutStage, setAtTutStage] = useState(isAttackerTutorial ? 1 : 6);
  const [tutVisible, setTutVisible] = useState(
    isAttackerTutorial || isDefenderTutorial ? true : false,
  );
  const [pigImage, setPigImage] = useState(Images.naugtypig);
  const [poop, setPoop] = useState(false);
  const [guardCount, setGuardCount] = useState(stage.guardCount);
  const [guardStateMap, setGuardStateMap] = useState(new Map());
  const [turn, setTurn] = useState(turns.defenderFirst);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const {height, width} = useWindowDimensions();
  const [gameWinner, setGameWinner] = useState(null);
  const [warning, setWarning] = useState('');
  const [nodeStateMap, setNodeStateMap] = useState(new Map());
  const [edgeStateMap, setEdgeStateMap] = useState(new Map());
  const [arrowX, setArrowX] = useState(0);
  const [arrowY, setArrowY] = useState(0);
  const [isTouched, setIsTouched] = useState(false);

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
  const sound = useRef(
    new Sound('fart.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        return;
      }
      sound.current.setVolume(inGameVolume);
      // loaded successfully
      // Play the sound with an onEnd callback
    }),
  );
  const cleaningSound = useRef(
    new Sound('scrape.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        return;
      }
      cleaningSound.current.setVolume(0);
    }),
  );

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
  const attackerName = 'Pig';
  const defenderName = 'Janitors';

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
      opacity.value = withTiming(1, {duration: poopDuration * (2 / 3)}, () => {
        opacity.value = withTiming(0, {duration: animationSpeed * (1 / 3)});
      });
      if (!attackedEdge.current) {
        return;
      }
      const {x1, x2, y1, y2} = edgeStateMap.get(attackedEdge.current);
      const newX = (x1 + x2) / 2 - 35;
      const newY = (y1 + y2) / 2;
      const config = {duration: poopDuration};
      poopX.value = inX.value;
      poopY.value = inY.value;
      poopX.value = withTiming(newX, config);
      poopY.value = withTiming(newY, config);
      translateX.value = withTiming(newX, config);
      translateY.value = withTiming(newY, config);

      rotation.value = withTiming(rotation.value + 720, {
        duration: poopDuration,
      });
      butwidth.value = withSpring(
        butwidth.value + 100,
        {duration: poopDuration * (1 / 3)},
        () => {
          butwidth.value = withSpring(butwidth.value - 100, {
            duration: poopDuration * (1 / 3),
          });
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
    animationSpeed,
    poopDuration,
  ]);

  function pooperPrakat() {
    setPigImage(Images.pigpoop);
    showAnimation.current.value = true;
    sound.current.play();
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
    function saveMomento(calledByUndo = false) {
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
        nodeIdToGuardIdMap: new Map(nodeIdToGuardIdMap.current),
        guardIdToNodeIdMap: new Map(guardIdToNodeIdMap.current),
      };
      momentoes.current.splice(currentMomentoIndex.current, Infinity, momento);
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
      applyMomento(momentoes.current[currentMomentoIndex.current]);
    }
  }

  function applyMomento(momento) {
    setNodeStateMap(momento.nodeStateMap);
    setGuardStateMap(momento.guardStateMap);
    [...momento.guardStateMap.keys()].forEach(key => {
      const state = guardStateMap.get(key);
      state.animateRef(state.cx, state.cy, 0);
    });

    nodeIdToGuardIdMap.current = momento.nodeIdToGuardIdMap;
    guardIdToNodeIdMap.current = momento.guardIdToNodeIdMap;

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
            r={horizontalScale(30)}
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
            thickness={horizontalScale(20)}
            onPress={onEdgePress}
            {...value}
          />
        );
      });
  }

  function renderGuards() {
    if (!guardStateMap) {
      return null;
    }
    return [...guardStateMap.keys()]
      .map(key => [key, guardStateMap.get(key)])
      .map(element => {
        const [key, value] = element;
        return (
          <Guard
            {...value}
            width={horizontalScale(70)}
            height={verticalScale(70)}
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

  function onGuardPress(guardId) {
    showGuard(guardIdToNodeIdMap.current.get(guardId));
  }

  function resetEdges() {
    const newEdgeStateMap = new Map();
    [...edgeStateMap.keys()].forEach(key => {
      const value = edgeStateMap.get(key);
      newEdgeStateMap.set(key, {
        ...value,
        moveGuard1: false,
        moveGuard2: false,
        isAttacked: false,
      });
    });
    setEdgeStateMap(newEdgeStateMap);
  }

  function restartGame() {
    goAgain();
  }

  function onButtonPress() {
    changeTurn();
  }

  function isGuardOnEdge(edgeId) {
    const [node1, node2] = edgeId.split(';');
    return (
      nodeIdToGuardIdMap.current.get(node1)?.length ||
      nodeIdToGuardIdMap.current.get(node2)?.length
    );
  }

  function playAutoAttacker(isCalledByRedo) {
    if (moves.current === 0) {
      setGameWinner(prev => (prev ? prev : winner.defender));
      if (mode === MODES.AUTO_ATTACKER) {
        onWin();
      }
      return;
    }
    guards.current = [];
    nodeIdToGuardIdMap.current.forEach((guard, nodeId) => {
      if (guard?.length) {
        guards.current.push(parseInt(nodeId, 10));
      }
    });
    guards.current.sort((a, b) => a - b);
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
    nodeIdToGuardIdMap.current.forEach((guard, nodeId) => {
      if (guard?.length) {
        guards.current.push(parseInt(nodeId, 10));
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
        onWin();
      }
    }
    return true;
  }

  function changeTurn(isCalledByRedo = false) {
    if (isLoading) {
      return;
    }
    setWarning('');
    setIsTouched(false);
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
      nodeIdToGuardIdMap.current.forEach((guard, nodeId) => {
        nodeGuardCounter.set(nodeId, guard?.length || 0);
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
        cleaningSound.current.play();
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
            nodeIdToGuardIdMap.current.get(nodeId1).pop();
          } else {
            nodeIdToGuardIdMap.current.get(nodeId1).shift();
          }
          guardIdToNodeIdMap.current.delete(guardId);
          if (nodeIdToGuardIdMap.current.get(nodeId2)?.length) {
            nodeIdToGuardIdMap.current.get(nodeId2).push(guardId);
          } else {
            nodeIdToGuardIdMap.current.set(nodeId2, [guardId]);
          }
          guardIdToNodeIdMap.current.set(guardId, nodeId2);
          guardState.animateRef(cx, cy);
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
        setEdgeStateMap(newEdgeStateMap);
        const [attackedNode1, attackedNode2] = attackedEdge.current.split(';');
        if (
          (!nodeIdToGuardIdMap.current.get(attackedNode1)?.length &&
            !nodeIdToGuardIdMap.current.get(attackedNode2)?.length) ||
          !wasCovered
        ) {
          setGameWinner(prev => (prev ? prev : winner.attacker));
        } else {
          setTimeout(() => {
            setPoop(false);
          }, cleanDuration / 2.0);
          resetEdges();
          attackedEdge.current = null;
          if (mode === MODES.AUTO_ATTACKER) {
            moves.current--;
            setTimeout(() => playAutoAttacker(), cleanDuration);
          } else if (mode === MODES.AUTO_DEFENDER) {
            moves.current--;
          }
          setTurn(turns.attacker);
          setPigImage(Images.naugtypig);
        }
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
      // if (mode === MODES.AUTO_ATTACKER) {
      //   return;
      // }
      if (isLoading) {
        return;
      }
      currTurn = currTurn === null ? turn : currTurn;
      setEdgeStateMap(prev => {
        const newEdgeStateMap = new Map(prev);
        if (currTurn === turns.attacker && mode !== MODES.AUTO_ATTACKER) {
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
          return newEdgeStateMap;
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
          return newEdgeStateMap;
        }
        return newEdgeStateMap;
      });
    },
    [isLoading, mode, turn],
  );

  function showGuardMovement(currEdgeStateMap, fromNodeId, toNodeId) {
    if (fromNodeId === toNodeId) {
      return;
    }
    let edgeId = fromNodeId + ';' + toNodeId;
    if (currEdgeStateMap.has(edgeId)) {
      const edgeState = currEdgeStateMap.get(edgeId);
      currEdgeStateMap.set(edgeId, {...edgeState, moveGuard1: true});
    } else {
      edgeId = toNodeId + ';' + fromNodeId;
      const edgeState = currEdgeStateMap.get(edgeId);
      if (edgeState) {
        currEdgeStateMap.set(edgeId, {...edgeState, moveGuard2: true});
      }
    }
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
    const newGuardStates = new Map(guardStateMap);
    if (currentTurn === turns.defenderFirst) {
      if (nodeIdToGuardIdMap.current.get(nodeId)?.length) {
        setGuardCount(prev => ++prev);
        const [guardId] = nodeIdToGuardIdMap.current.get(nodeId);
        newGuardStates.delete(guardId);
        nodeIdToGuardIdMap.current.delete(nodeId);
        guardIdToNodeIdMap.current.delete(guardId);
      } else {
        setGuardCount(prev => --prev);
        const {cx, cy} = nodeStateMap.get(nodeId);
        newGuardStates.set(nodeId, {cy, cx});
        nodeIdToGuardIdMap.current.set(nodeId, [nodeId]);
        guardIdToNodeIdMap.current.set(nodeId, nodeId);
      }
      setGuardStateMap(newGuardStates);
    } else if (currentTurn === turns.defenderLater) {
      const newNodeStateMap = new Map(nodeStateMap);
      const nodeState = newNodeStateMap.get(nodeId);
      if (selected.current) {
        if (adjList.current.get(selected.current).includes(nodeId)) {
          const newEdgeStateMap = new Map(edgeStateMap);
          showGuardMovement(newEdgeStateMap, selected.current, nodeId);
          setEdgeStateMap(newEdgeStateMap);
          setIsTouched(true);
        }
        const selectedNodeState = newNodeStateMap.get(selected.current);
        newNodeStateMap.set(selected.current, {
          ...selectedNodeState,
          isSelected: false,
        });
        selected.current = null;
        setNodeStateMap(newNodeStateMap);
      } else if (nodeIdToGuardIdMap.current.get(nodeId)?.length) {
        newNodeStateMap.set(nodeId, {...nodeState, isSelected: true});
        selected.current = nodeId;
        setNodeStateMap(newNodeStateMap);
      }
    }
  }

  let buttonTitle =
    turn === turns.attacker
      ? 'Poop'
      : turn === turns.defenderFirst
      ? 'Confirm Placement'
      : mode === MODES.AUTO_DEFENDER
      ? 'Continue'
      : 'Clean';
  let headingStyle = styles.heading;
  let headingText = '';
  if (gameWinner) {
    buttonTitle = 'Restart';
    let winText =
      gameWinner === winner.attacker
        ? `${attackerName} Won`
        : `${defenderName} Win`;
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
    headingText = `Loading... ${Math.floor(loadingPercentage)}%`;
  } else {
    switch (mode) {
      case MODES.AUTO_ATTACKER:
        switch (turn) {
          case turns.attacker:
            headingText = `${attackerName}'s Turn`;
            break;
          case turns.defenderLater:
            headingText = `Your turn | Turns Left: ${(moves.current + 1) / 2}`;
            break;
          case turns.defenderFirst:
            headingText = `Janitors Left: ${guardCount}`;
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
            : `${defenderName}' Turn`;
        break;
      default:
        switch (turn) {
          case turns.attacker:
            headingText = `${attackerName}'s Turn`;
            break;
          case turns.defenderLater:
            headingText = `${defenderName}' Turn`;
            break;
          default:
            headingText = `${defenderName} Left: ${guardCount}`;
            headingStyle = [
              styles.heading,
              {
                color: guardCount < 0 ? 'red' : 'white',
              },
            ];
        }
    }
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
          if (
            mode === MODES.AUTO_DEFENDER &&
            stage.guards.includes(parseInt(id, 10))
          ) {
            const guardState = {
              cy: parseFloat(y),
              cx: parseFloat(x),
              id: String(id),
            };
            newGuardStateMap.set(String(id), guardState);
            nodeIdToGuardIdMap.current.set(id, [id]);
            guardIdToNodeIdMap.current.set(id, id);
          }
          newNodeStateMap.set(id, {
            cx: parseFloat(x),
            cy: parseFloat(y),
            id: String(element.node_id.id),
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
          adjListForMap[element.edge_list[0].id].push(element.edge_list[1].id);
          adjListForMap[element.edge_list[1].id].push(element.edge_list[0].id);
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
        console.log('map not found');
        if (mode === MODES.AUTO_ATTACKER) {
          returnVal = 'loading';
          setTimeout(() => {
            stage.map = Object.fromEntries(
              giveMapA(
                stage.guardCount,
                adjListForMap,
                edgeList.current,
                stage.moves,
                progress => setLoadingPercentage(progress * 100),
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
                progress => setLoadingPercentage(progress * 100),
              ),
            );
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
    currentMomentoIndex.current > 0
      ? styles.buttonEnabled
      : styles.buttonDisabled,
  ];
  const redoButtonStyle = [
    styles.redo,
    currentMomentoIndex.current < maxMomentoIndex.current
      ? styles.buttonEnabled
      : styles.buttonDisabled,
  ];
  let angle = 0;
  if (attackedEdge.current) {
    const edgeState = edgeStateMap.get(attackedEdge.current);
    if (edgeState) {
      const {x1, x2, y1, y2} = edgeState;
      angle = ((y1 + y2) / 2 - inY.value) / ((x1 + x2) / 2 - inX.value);
    }
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
        {!(warning == '') && <Text style={styles.warning}>{warning}</Text>}
        {!gameWinner && (
          <Pressable
            onPressIn={onButtonPress}
            style={[
              styles.button,
              (turn === turns.attacker && !attackedEdge.current) ||
              (turn === turns.defenderFirst && guardCount !== 0) ||
              (turn === turns.defenderLater &&
                !isTouched &&
                mode !== MODES.AUTO_DEFENDER)
                ? styles.buttonDisabled
                : styles.buttonEnabled,
            ]}>
            <Text style={styles.buttonText}>{buttonTitle}</Text>
          </Pressable>
        )}
        <GestureDetector gesture={pan}>
          <>
            <Animated.Image
              source={pigImage}
              style={[styles.pig, animatedStyles]}
            />
            {/* {pigImage !== Images.naugtypig && (
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
            )} */}
            {poop && (
              <View style={{position: 'absolute'}} pointerEvents="none">
                <Poop {...{poopX, poopY, animatedStylesPoop}} key={'Poop'} />
              </View>
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
      {gameWinner && !isAttackerTutorial && !isDefenderTutorial && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!gameWinner}
          onRequestClose={() => {
            navigation.goBack();
          }}>
          <View style={[styles.centeredView]}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{headingText}</Text>
              <View style={{flexDirection: 'row'}}>
                {!isAttackerTutorial && !isDefenderTutorial && (
                  <Pressable
                    style={[styles.modalButton, styles.buttonOpen]}
                    onPress={restartGame}>
                    <Text style={styles.textStyle}>Replay</Text>
                  </Pressable>
                )}
                {goNextStage && (
                  <Pressable
                    style={[styles.modalButton, styles.buttonOpen]}
                    onPress={goNextStage}>
                    <Text style={styles.textStyle}>Next</Text>
                  </Pressable>
                )}
                <Pressable
                  style={[styles.modalButton, styles.buttonOpen]}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Text style={styles.textStyle}>
                    {!isAttackerTutorial && !isDefenderTutorial
                      ? 'Levels'
                      : 'Exit'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
}
function isAutomatic(mode) {
  return mode === MODES.AUTO_ATTACKER || mode === MODES.AUTO_DEFENDER;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '20%',
    // backgroundColor: 'yellow',
  },
  imageBackground: {
    flex: 1,
  },
  modalText: {
    marginBottom: verticalScale(15),
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  heading: {
    paddingLeft: horizontalScale(7),
    paddingRight: horizontalScale(3),
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(2),
    alignSelf: 'center',
    fontSize: horizontalScale(16),
    top: verticalScale(4),
    fontWeight: 'bold',
    color: 'white',
    width: horizontalScale(190),
    height: verticalScale(35),
    backgroundColor: 'black',
    borderRadius: horizontalScale(10),
  },
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
  button: {
    borderRadius: horizontalScale(20),
    padding: horizontalScale(10),
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '90%',
    width: '60%',
    right: 0,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: '#555',
  },
  buttonEnabled: {
    backgroundColor: '#F194FF',
  },
  warning: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: verticalScale(500),
    color: 'red',
    fontSize: horizontalScale(14),
    alignSelf: 'center',
  },
  undo: {
    borderRadius: horizontalScale(20),
    padding: horizontalScale(10),
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '90%',
    backgroundColor: 'grey',
    left: '0%',
    width: '20%',
  },
  redo: {
    borderRadius: horizontalScale(20),
    padding: horizontalScale(10),
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '90%',
    width: '20%',
    backgroundColor: 'grey',
    left: '20%',
  },
  pig: {
    position: 'absolute',
    top: verticalScale(200),
    left: horizontalScale(100),
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    verticalAlign: 'middle',
    top: '45%',
    // borderColor: 'black',
    // borderWidth: 20,
    // marginTop: 22,
  },
  modalView: {
    alignSelf: 'center',
    margin: '4%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: horizontalScale(20),
    padding: '4%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: horizontalScale(200),
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: horizontalScale(16),
  },
  modalButton: {
    borderRadius: horizontalScale(20),
    padding: horizontalScale(10),
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
});
