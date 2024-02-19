import {React, useState, useEffect, useRef, useCallback} from 'react';
import Images from '../assets/Images';

import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
} from 'react-native';

import TouchableCircle from './TouchableCircle';

import TouchableLine from './TouchableLine';

import parse from 'dotparser';

import Sound from 'react-native-sound';
import {tupleToString} from '../MainApp/MainAlgoBruteForce';
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
import Poop from './Poop';
let showAnimation = false;
const Turns = {
  DefenderFirst: 1,

  DefenderLater: 2,

  Attacker: 3,
};

const Winner = {
  Defender: 1,

  Attacker: 2,
};

const Modes = {
  AutoAttacker: 'autoAttacker',

  AutoDefender: 'autoDefender',
};

export default function Stage({stage, mode}) {
  const [pigImage, setPigImage] = useState(Images.naugtypig);
  const [poop, setPoop] = useState(false);
  const [guardCount, setGuardCount] = useState(stage.guardCount);

  const [turn, setTurn] = useState(Turns.DefenderFirst);

  const [isLoading, setIsLoading] = useState(true);

  const [gameWinner, setGameWinner] = useState(null);

  const [warning, setWarning] = useState('');

  const [nodeStateMap, setNodeStateMap] = useState(new Map());

  const [edgeStateMap, setEdgeStateMap] = useState(new Map());

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
  // const [showAnimation, setShowAnimation] = useState(false);
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
  const butwidth = useSharedValue(100);
  const sound = new Sound('fart.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    console.log(
      'duration in seconds: ' +
        sound.getDuration() +
        'number of channels: ' +
        sound.getNumberOfChannels(),
    );

    // Play the sound with an onEnd callback
  });

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
  }));
  const animatedStylesPoop = useAnimatedStyle(() => {
    // console.log('ran poop style');
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });
  const animatedStylesFire = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateX: translateX.value - 50,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));
  useEffect(() => {
    if (showAnimation) {
      showAnimation = false;
      // setShowAnimation(false);
      opacity.value = withTiming(1, {duration: 2000}, () => {
        opacity.value = withTiming(0, {duration: 1000});
      });
      console.log('attack edge is ', attackedEdge.current);
      // const {x1, x2, y1, y2} = edgeStateMap.get(attackedEdge.current);
      // console.log({x1, x2, y1, y2});
      // console.log(edgeStateMap.get(attackedEdge.current));
      // m.current = ((y1 + y2) / 2 - inY.value) / ((x1 + x2) / 2 - inX.value);
      // console.log(((y1 + y2) / 2 - inY.value) / ((x1 + x2) / 2 - inX.value));
      // c.current = inY.value - inX.value * m.current;
      // console.log('value is ', 1 / 2);
      // console.log('m,c is ', m.current, c.current);
      translateX.value = withTiming(
        translateX.value +
          (edgeStateMap.get(attackedEdge.current).x1 +
            edgeStateMap.get(attackedEdge.current).x2) /
            2 -
          inX.value -
          35,
        {duration: 3000},
        () => {
          console.log('x value ');
          poopX.value = translateX.value + poopX.value;
          translateX.value = 0;
        },
      );
      translateY.value = withTiming(
        translateY.value +
          (edgeStateMap.get(attackedEdge.current).y1 +
            edgeStateMap.get(attackedEdge.current).y2) /
            2 -
          inY.value,
        {duration: 3000},
        () => {
          console.log('y value ');
          poopY.value = translateY.value + poopY.value;
          translateY.value = 0;
        },
      );
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
    showAnimation,
  ]);

  function pooperPrakat() {
    console.log('pahunch gaya');
    setPigImage(Images.pigpoop);
    // set poop
    showAnimation = true;
    // setShowAnimation(true);

    sound.play(error => {
      console.log('some error', error);
    });
    setPoop(true);
    poopX.value = inX.value;
    poopY.value = inY.value;
    // set shared location
    //setpoop fire angle

    // set pig naugty

    //
  }

  // Initializer

  useEffect(() => {
    if (construct()) {
      if (mode === Modes.AutoDefender) {
        stage.guards.sort((a, b) => a - b);

        moveMap.current = new Map(Object.entries(stage.map));

        setTurn(Turns.Attacker);
      } else if (mode === Modes.AutoAttacker) {
        moveMap.current = new Map(Object.entries(stage.map));
      }
    } else {
      setWarning('An error occurred');
    }

    setIsLoading(false);
  }, [construct, mode, stage.guards, stage.map]);

  const saveMomento = useCallback(
    function (calledByUndo = false) {
      const momento = {
        nodes: [],

        edges: [],

        moves: moves.current,

        attackedEdge: attackedEdge.current,

        turn,

        gameWinner,
      };

      [...nodeStateMap.keys()].forEach(key => {
        const nodeState = nodeStateMap.get(key);

        momento.nodes.push({
          ...nodeState,
        });
      });

      [...edgeStateMap.keys()].forEach(key => {
        const edgeState = edgeStateMap.get(key);

        momento.edges.push({
          ...edgeState,
        });
      });

      momentoes.current.slice(0, currentMomentoIndex.current);

      momentoes.current.push(momento);

      if (!calledByUndo) {
        maxMomentoIndex.current = currentMomentoIndex.current + 1;
      }

      currentMomentoIndex.current = maxMomentoIndex.current;
    },

    [edgeStateMap, gameWinner, nodeStateMap, turn],
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
      (mode === Modes.AutoDefender && turn === Turns.Attacker) ||
      (mode === Modes.AutoAttacker &&
        (turn === Turns.DefenderFirst || turn === Turns.DefenderLater)) ||
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
    const newNodeStateMap = new Map();

    momento.nodes.forEach(value => {
      newNodeStateMap.set(value.id, value);
    });

    setNodeStateMap(newNodeStateMap);

    const newEdgeStateMap = new Map();

    momento.edges.forEach(value => {
      newEdgeStateMap.set(value.id, value);
    });

    setEdgeStateMap(newEdgeStateMap);

    attackedEdge.current = momento.attackedEdge;

    moves.current = momento.moves;

    setTurn(momento.turn);

    setGameWinner(momento.gameWinner);
  }

  function renderNodes() {
    return [...nodeStateMap.keys()]

      .map(key => nodeStateMap.get(key))

      .map(value => {
        return (
          <TouchableCircle
            key={value.id}
            radius={30}
            showGuard={showGuard}
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
            onEdgePress={onEdgePress}
            {...value}
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

    if (mode === Modes.AutoDefender) {
      const newNodeStateMap = new Map(nodeStateMap);

      [...nodeStateMap.keys()].forEach(key => {
        const value = nodeStateMap.get(key);

        if (stage.guards.includes(parseInt(key, 10))) {
          newNodeStateMap.set(key, {...value, isGuardPresent: true});
        }
      });

      setTurn(Turns.Attacker);

      setGameWinner(null);

      setNodeStateMap(newNodeStateMap);
    } else {
      setTurn(Turns.DefenderFirst);

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
      setGameWinner(prev => (prev ? prev : Winner.Defender));

      return;
    }

    guards.current = [];

    const newNodeStateMap = new Map(nodeStateMap);

    newNodeStateMap.forEach(nodeState => {
      if (nodeState.isGuardPresent) {
        guards.current.push(parseInt(nodeState.id, 10));
      }
    });

    let toAttack = moveMap.current.get(
      tupleToString(guards.current) + ';' + moves.current,
    )[0];

    attackedEdge.current =
      edgeList.current[toAttack][0] + ';' + edgeList.current[toAttack][1];

    onEdgePress(attackedEdge.current, Turns.Attacker);

    moves.current--;

    checkAttack(isCalledByRedo);
  }

  function playAutoDefender() {
    --moves.current;

    if (moves.current <= 0) {
      setGameWinner(prev => (prev ? prev : Winner.Defender));

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
    } else {
      // Saving momento.

      if (mode !== Modes.AutoAttacker && !isCalledByRedo) {
        saveMomento();
      }

      if (isGuardOnEdge(attackedEdge.current)) {
        setTurn(Turns.DefenderLater);
      } else {
        setGameWinner(prev => (prev ? prev : Winner.Attacker));
      }
    }
  }

  function changeTurn(isCalledByRedo = false) {
    if (isLoading) {
      return;
    }

    setWarning('');

    if (turn === Turns.DefenderFirst) {
      if (guardCount === 0) {
        // Saving momento.

        if (mode !== Modes.AutoDefender && !isCalledByRedo) {
          saveMomento();
        }

        if (mode === Modes.AutoAttacker) {
          playAutoAttacker(isCalledByRedo);
        } else {
          setTurn(Turns.Attacker);
        }
      } else {
        setWarning('Guards left should be 0');
      }
    } else if (turn === Turns.Attacker) {
      // come here
      pooperPrakat();

      checkAttack(isCalledByRedo);

      if (mode === Modes.AutoDefender) {
        playAutoDefender();
      }
    } /* turn = Turns.DefenderLater */ else {
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

        if (mode !== Modes.AutoDefender && !isCalledByRedo) {
          saveMomento();
        }

        let wasCovered = false;

        const guardExistsSet = new Set();

        const moveGuard = (edgeId, node1, node2) => {
          if (edgeId === attackedEdge.current) {
            wasCovered = true;
          }

          if (!guardExistsSet.has(node1)) {
            const nodeState = newNodeStateMap.get(node1);

            nodeState.isGuardPresent = false;

            newNodeStateMap.set(node1, nodeState);
          }

          const nodeState = newNodeStateMap.get(node2);

          nodeState.isGuardPresent = true;

          newNodeStateMap.set(node2, nodeState);

          guardExistsSet.add(node2);
        };

        newEdgeStateMap.forEach((edgeState, edgeId) => {
          const [node1, node2] = edgeId.split(';');

          if (edgeState.moveGuard1) {
            moveGuard(edgeId, node1, node2, guardExistsSet);
          }

          if (edgeState.moveGuard2) {
            moveGuard(edgeId, node2, node1, guardExistsSet);
          }
        });

        setNodeStateMap(newNodeStateMap);

        setEdgeStateMap(newEdgeStateMap);

        const [attackedNode1, attackedNode2] = attackedEdge.current.split(';');

        if (
          (!nodeStateMap.get(attackedNode1).isGuardPresent &&
            !nodeStateMap.get(attackedNode2).isGuardPresent) ||
          !wasCovered
        ) {
          setGameWinner(prev => (prev ? prev : Winner.Attacker));
        } else {
          resetEdges();

          attackedEdge.current = null;

          if (mode === Modes.AutoAttacker) {
            moves.current--;

            playAutoAttacker();
          } else if (mode === Modes.AutoDefender) {
            moves.current--;
          }

          setTurn(Turns.Attacker);
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

      if (currTurn === Turns.Attacker) {
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
        currTurn === Turns.DefenderLater &&
        mode !== Modes.AutoDefender
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

  function showGuard(nodeId, bySystem, currentTurn = null) {
    if (!bySystem && (isLoading || mode === Modes.AutoDefender)) {
      return;
    }

    currentTurn = currentTurn === null ? turn : currentTurn;

    const newNodeStateMap = new Map(nodeStateMap);

    const nodeState = newNodeStateMap.get(nodeId);

    if (currentTurn === Turns.DefenderFirst) {
      if (nodeState.isGuardPresent) {
        setGuardCount(prev => ++prev);

        newNodeStateMap.set(nodeId, {...nodeState, isGuardPresent: false});
      } else {
        setGuardCount(prev => --prev);

        newNodeStateMap.set(nodeId, {...nodeState, isGuardPresent: true});
      }

      setNodeStateMap(newNodeStateMap);
    } else if (currentTurn === Turns.DefenderLater) {
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
      gameWinner === Winner.Attacker ? 'Attacker Won' : 'Defender Won';

    let textColor = {color: 'white'};

    if (mode) {
      const isAutoAttacker = mode === Modes.AutoAttacker;

      const isWinnerAttacker = gameWinner === Winner.Attacker;

      winText = isAutoAttacker === isWinnerAttacker ? 'You Lose' : 'You Won';

      textColor =
        isAutoAttacker === isWinnerAttacker ? styles.red : styles.green;
    }

    headingStyle = [styles.heading, textColor];

    headingText = `Game Over, ${winText}`;
  } else if (isLoading) {
    headingText = 'Loading... Please Wait';
  } else {
    switch (mode) {
      case Modes.AutoAttacker:
        switch (turn) {
          case Turns.Attacker:
            headingText = "Attacker's Turn";

            break;

          case Turns.DefenderLater:
            headingText = `Your turn | Turns Left: ${(moves.current + 1) / 2}`;

            break;

          case Turns.DefenderFirst:
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

      case Modes.AutoDefender:
        headingText =
          turn === Turns.Attacker
            ? `Your turn | Turns Left: ${(moves.current + 1) / 2}`
            : "Defender's Turn";

        break;

      default:
        switch (turn) {
          case Turns.Attacker:
            headingText = "Attacker's Turn";

            break;

          case Turns.DefenderLater:
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
  }

  const construct = useCallback(() => {
    let ast = null;

    try {
      ast = parse(stage.graph);
    } catch {
      return false;
    }

    if (!ast) {
      return false;
    }

    adjList.current = new Map();

    edgeList.current = [];

    const newNodeStateMap = new Map();

    const newEdgeStateMap = new Map();

    const children = ast[0].children;

    for (const element of children) {
      if (element.type === 'node_stmt') {
        const [x, y] = element.attr_list[0].eq.split(' ');

        const id = String(element.node_id.id);

        adjList.current.set(id, []);

        let isGuardPresent = false;

        if (
          mode === Modes.AutoDefender &&
          stage.guards.includes(parseInt(id, 10))
        ) {
          isGuardPresent = true;
        }

        newNodeStateMap.set(id, {
          x: parseFloat(x),

          y: parseFloat(y),

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

          x1: node1.x,

          y1: node1.y,

          x2: node2.x,

          y2: node2.y,

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

    setNodeStateMap(newNodeStateMap);

    setEdgeStateMap(newEdgeStateMap);

    return true;
  }, [mode, stage.graph, stage.guards]);

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
    console.log({x1, x2, y1, y2});
    console.log(edgeStateMap.get(attackedEdge.current));
    angle = ((y1 + y2) / 2 - inY.value) / ((x1 + x2) / 2 - inX.value);
  }

  console.log(poop, showAnimation);
  console.log('in values is ', inX.value, inY.value);
  console.log('translate x, y ', translateX.value, translateY.value);
  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
        source={Images.farm}
        resizeMode="cover"
        style={{
          flex: 1,
        }}>
        <Text style={[headingStyle]}>{headingText}</Text>

        <Pressable onPressIn={undo} style={undoButtonStyle}>
          <Text>Undo</Text>
        </Pressable>

        <Pressable onPressIn={redo} style={redoButtonStyle}>
          <Text>Redo</Text>
        </Pressable>

        <View style={styles.container}>
          {renderEdges()}

          {renderNodes()}
        </View>

        <Text style={styles.warning}>{warning}</Text>

        <Pressable onPressIn={onButtonPress} style={styles.button}>
          <Text>{buttonTitle}</Text>
        </Pressable>
        <GestureDetector gesture={pan}>
          <>
            <Animated.Image
              source={pigImage}
              style={[
                {
                  position: 'absolute',
                  top: 100,
                  left: 100,
                  width: butwidth,
                  height: butwidth,
                },
                animatedStyles,
                // pooperStyle,
              ]}
            />
            {pigImage !== Images.naugtypig && (
              <Animated.View
                style={[
                  {
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    left: poopX,
                    top: poopY,
                  },
                  {},
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
                <Poop {...{poopX, poopY, animatedStylesPoop}} />
              </>
            )}
          </>
        </GestureDetector>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

function isAutomatic(mode) {
  return mode === Modes.AutoAttacker || mode === Modes.AutoDefender;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 30,

    // backgroundColor: 'yellow',
  },

  heading: {
    alignSelf: 'center',

    fontSize: 20,

    top: 5,

    color: 'black',

    height: 35,
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
});
