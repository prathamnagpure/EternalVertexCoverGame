import {React, Component} from 'react';
import {View, Pressable, StyleSheet, Text, Button, Alert} from 'react-native';
import TouchableCircle from './TouchableCircle';
import TouchableLine from './TouchableLine';
import {giveMap, tupleToString} from '../MainApp/MainAlgoBruteForce';
import {giveMap as giveDefenderMap} from '../MainApp/MainAlgoBruteForceD';
const Turns = {
  DefenderFirst: 0,
  DefenderLater: 1,
  Attacker: 2,
};

const Winner = {
  Defender: 1,
  Attacker: 2,
};

const Modes = {
  AutoAttacker: 'autoAttacker',
  AutoDefender: 'autoDefender',
};

export default class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guardCount: this.props.stage.guardCount,
      turn: Turns.DefenderFirst,
      isLoading: true,
      gameWinner: undefined,
      warning: '',
    };
    const parse = require('dotparser');
    let ast = null;
    try {
      ast = parse(this.props.stage.graph);
    } catch {
      return <View />;
    }
    if (!ast) {
      return <View />;
    }
    const children = ast[0].children;
    for (const element of children) {
      if (element.type === 'node_stmt') {
        let coordinates = element.attr_list[0].eq.split(' ');
        this.nodes.push({
          id: String(element.node_id.id),
          pos: {x: parseFloat(coordinates[0]), y: parseFloat(coordinates[1])},
        });
        this.nodesMap.set(String(element.node_id.id), {neighbours: []});
        this.numNodes++;
      } else {
        this.edges.push([
          this.nodes[element.edge_list[0].id],
          this.nodes[element.edge_list[1].id],
        ]);
        if (
          this.props.mode === Modes.AutoAttacker ||
          this.props.mode === Modes.AutoDefender
        ) {
          this.edgeList.push([
            element.edge_list[0].id,
            element.edge_list[1].id,
          ]);
        }
        this.nodesMap
          .get(String(element.edge_list[0].id))
          .neighbours.push(String(element.edge_list[1].id));
        this.nodesMap
          .get(String(element.edge_list[1].id))
          .neighbours.push(String(element.edge_list[0].id));
      }
    }
    if (
      this.props.mode === Modes.AutoAttacker ||
      this.props.mode === Modes.AutoDefender
    ) {
      this.nodes.forEach(_ => {
        this.adjList.push([]);
      });
      this.edgeList.forEach(element => {
        this.adjList[element[0]].push(element[1]);
        this.adjList[element[1]].push(element[0]);
      });
    }
  }

  nodes = [];
  edges = [];
  edgeList = [];
  nodesMap = new Map();
  edgesMap = new Map();
  algoEdgeMap = new Map();
  numNodes = 0;
  moveMap = undefined;
  adjList = [];
  guards = [];
  moves = this.props.stage.moves;
  guardNum = this.props.stage.guardCount;
  attackedEdge = undefined;
  selected = undefined;
  momentos = [];
  currentMomentoIndex = 0;
  maxMomentoIndex = 0;

  saveMomento = (calledByUndo = false) => {
    this.momentos = this.momentos.slice(0, this.currentMomentoIndex);
    let momento = {
      nodes: [],
      edges: [],
      moves: this.moves,
      attackedEdge: this.attackedEdge,
      state: {turn: this.state.turn, gameWinner: this.state.gameWinner},
    };
    this.nodesMap.forEach((value, key) => {
      let touchableCircle = value.ref;
      momento.nodes.push({
        id: key,
        state: {
          isGuardPresent: touchableCircle.state.isGuardPresent,
          isSelected: touchableCircle.state.isSelected,
        },
      });
    });

    this.edgesMap.forEach((value, key) => {
      let touchableLine = value;
      momento.edges.push({
        id: key,
        state: {
          isAttacked: touchableLine.state.isAttacked,
          moveGuard1: touchableLine.state.moveGuard1,
          moveGuard2: touchableLine.state.moveGuard2,
        },
      });
    });
    this.momentos.push(momento);
    if (!calledByUndo) {
      this.maxMomentoIndex = this.currentMomentoIndex + 1;
    }
    this.currentMomentoIndex = this.maxMomentoIndex;
  };

  undo = () => {
    if (this.currentMomentoIndex == 0) return;
    if (this.currentMomentoIndex == this.maxMomentoIndex) {
      this.saveMomento(true);
    }
    this.currentMomentoIndex--;
    this.applyMomento(this.momentos[this.currentMomentoIndex]);
  };

  redo = () => {
    if (this.currentMomentoIndex == this.maxMomentoIndex) return;
    this.currentMomentoIndex++;
    if (
      (this.props.mode === Modes.AutoDefender &&
        this.state.turn === Turns.Attacker) ||
      (this.props.mode === Modes.AutoAttacker &&
        (this.state.turn === Turns.DefenderFirst ||
          this.state.turn === Turns.DefenderLater)) ||
      !this.props.mode
    ) {
      this.applyMomento(this.momentos[this.currentMomentoIndex]);
    }
  };

  applyMomento = momento => {
    momento.nodes.forEach(value => {
      let id = value.id;
      let state = value.state;
      let touchableCircle = this.nodesMap.get(id).ref;
      touchableCircle.setState(state);
    });
    momento.edges.forEach(value => {
      let id = value.id;
      let state = value.state;
      let touchableLine = this.edgesMap.get(id);
      touchableLine.setState(state);
    });
    this.moves = momento.moves;
    this.attackedEdge = momento.attackedEdge;
    this.setState(momento.state);
    if (momento.state.gameWinner) {
      this.finishGame(momento.state.gameWinner);
    }
  };

  componentDidMount() {
    if (this.props.mode === Modes.AutoDefender) {
      this.nodesMap.forEach((value, key) => {
        if (this.props.stage.guards.includes(parseInt(key))) {
          value.ref.setState({isGuardPresent: true});
        }
      });
      this.setState({turn: Turns.Attacker});
    }
    setTimeout(() => {
      this.calculateMap();
    }, 0);
  }

  calculateMap() {
    if (this.props.mode === Modes.AutoDefender) {
      this.props.stage.guards.sort((a, b) => a - b);
      console.log(this.props.stage.graphNum);
      console.log();
      console.log(
        this.guardNum,
        ',',
        this.props.stage.guards,
        ',',
        this.adjList,
        ',',
        this.edgeList,
        ',',
        this.props.stage.moves - 1,
        ',',
      );

      //this.moveMap = giveDefenderMap(
      //this.guardNum,
      //this.props.stage.guards,
      //this.adjList,
      //this.edgeList,
      //this.props.stage.moves - 1,
      //);
      this.moveMap = new Map(Object.entries(this.props.stage.map));
    } else if (this.props.mode === Modes.AutoAttacker) {
      console.log(this.props.stage.graphNum);
      console.log('yoyou');
      console.log(
        this.guardNum,
        ',',
        this.adjList,
        ',',
        this.edgeList,
        ',',
        this.props.stage.moves,
        ',',
      );
      //this.moveMap = giveMap(
      //this.guardNum,
      //this.adjList,
      //this.edgeList,
      //this.props.stage.moves,
      //);
      //console.log(this.props.stage.map);
      this.moveMap = new Map(Object.entries(this.props.stage.map));
      console.log(this.moveMap);
    }
    this.setState({isLoading: false});
  }

  renderNodes = () => {
    return this.nodes.map(node => {
      return (
        <TouchableCircle
          key={node.id}
          id={String(node.id)}
          x={node.pos.x}
          y={node.pos.y}
          radius={30}
          showGuard={this.showGuard}
          ref={ref => (this.nodesMap.get(node.id).ref = ref)}
        />
      );
    });
  };

  renderEdges = () => {
    return this.edges.map(edge => {
      const [startNode, endNode] = edge;
      return (
        <TouchableLine
          key={startNode.id + ';' + endNode.id}
          id={startNode.id + ';' + endNode.id}
          x1={startNode.pos.x}
          y1={startNode.pos.y}
          x2={endNode.pos.x}
          y2={endNode.pos.y}
          thickness={17}
          onEdgePress={this.onEdgePress}
          ref={ref => this.edgesMap.set(startNode.id + ';' + endNode.id, ref)}
        />
      );
    });
  };

  finishGame = winner => {
    let winText = winner === Winner.Attacker ? 'Attacker Won' : 'Defender Won';
    let textColor = {color: 'white'};
    if (this.props.mode) {
      const isAutoAttacker = this.props.mode === Modes.AutoAttacker;
      const isWinnerAttacker = winner === Winner.Attacker;
      winText = isAutoAttacker === isWinnerAttacker ? 'You Lose' : 'You Won';
      textColor =
        isAutoAttacker === isWinnerAttacker
          ? this.styles.red
          : this.styles.green;
    }
    this.heading = (
      <Text style={[this.styles.heading, textColor]}>
        {`Game Over, ${winText}`}
      </Text>
    );
    this.setState({gameWinner: winner});
  };

  resetNodes() {
    this.nodesMap.forEach((value, key) => {
      value.ref.setState({isGuardPresent: false, isSelected: false});
    });
  }

  resetEdges() {
    this.edgesMap.forEach(value => {
      value.setState({
        moveGuard1: false,
        moveGuard2: false,
        isAttacked: false,
      });
    });
  }

  restartGame = () => {
    this.currentMomentoIndex = 0;
    this.maxMomentoIndex = 0;
    this.momentos = [];
    this.moves = this.props.stage.moves;
    this.attackedEdge = undefined;
    this.resetNodes();
    this.resetEdges();
    if (this.props.mode === Modes.AutoDefender) {
      this.nodesMap.forEach((value, key) => {
        if (this.props.stage.guards.includes(parseInt(key))) {
          value.ref.setState({isGuardPresent: true});
        }
      });
      this.setState({turn: Turns.Attacker, gameWinner: undefined});
    } else {
      this.setState({
        turn: Turns.DefenderFirst,
        gameWinner: undefined,
        guardCount: this.props.stage.guardCount,
      });
    }
  };

  onButtonPress = () => {
    if (this.state.gameWinner) {
      this.restartGame();
    } else {
      this.changeTurn();
    }
  };

  changeTurn = (calledByRedo = false) => {
    if (this.state.isLoading) {
      return;
    }
    this.setState({warning: ''});
    if (this.state.turn === Turns.DefenderFirst) {
      if (this.state.guardCount === 0) {
        // Saving momento.
        if (this.props.mode != Modes.AutoDefender && !calledByRedo) {
          this.saveMomento();
        }

        let completeMove = () => {};
        if (this.props.mode === Modes.AutoAttacker) {
          completeMove = () => {
            this.guards = [];
            this.nodesMap.forEach(element => {
              if (element.ref.state.isGuardPresent) {
                this.guards.push(parseInt(element.ref.props.id));
              }
            });
            console.log(tupleToString(this.guards) + ';' + this.moves);
            let toAttack = this.moveMap.get(
              tupleToString(this.guards) + ';' + this.moves,
            )[0];
            this.attackedEdge = this.edgesMap.get(
              this.edgeList[toAttack][0] + ';' + this.edgeList[toAttack][1],
            );
            this.onEdgePress(this.attackedEdge);
            this.moves--;
            this.changeTurn();
          };
        }
        this.setState({turn: Turns.Attacker}, completeMove);
      } else {
        this.setState({warning: 'Guards left should be 0'});
      }
    } else if (this.state.turn === Turns.Attacker) {
      let completeMove = () => {};
      if (this.props.mode === Modes.AutoDefender) {
        // Automatically playing Defenders turn.
        completeMove = () => {
          this.moves--;
          if (this.moves <= 0) {
            this.finishGame(Winner.Defender);
            return;
          }
          this.guards = [];
          this.nodesMap.forEach(element => {
            if (element.ref.state.isGuardPresent) {
              this.guards.push(parseInt(element.ref.props.id));
            }
          });
          this.guards.sort((a, b) => a - b);
          const [node1, node2] = this.attackedEdge.props.id.split(';');
          let edgeIndex = -1;
          this.edgeList.forEach((value, index) => {
            if (value[0] == node1 && value[1] == node2) {
              edgeIndex = index;
            }
          });
          const nextMove = this.moveMap.get(
            tupleToString(this.guards) + ';' + edgeIndex + ';' + this.moves,
          );
          const newPos = nextMove[0];
          const changes = nextMove[nextMove.length - 1];
          newPos.forEach(async (value, index) => {
            const nodeComponent1 = this.nodesMap.get(
              String(this.guards[changes[index]]),
            );
            const nodeComponent2 = this.nodesMap.get(String(value));
            this.showGuard(nodeComponent1.ref, true);
            this.showGuard(nodeComponent2.ref, true);
          });
          //this.changeTurn();
        };
      }

      if (this.attackedEdge === undefined) {
        this.setState({warning: 'You have to attack an edge'});
      } else {
        // Saving momento.
        if (this.props.mode !== Modes.AutoAttacker && !calledByRedo) {
          this.saveMomento();
        }
        const [node1, node2] = this.attackedEdge.props.id.split(';');
        if (
          !this.nodesMap.get(node1).ref.state.isGuardPresent &&
          !this.nodesMap.get(node2).ref.state.isGuardPresent
        ) {
          this.finishGame(Winner.Attacker);
        } else {
          this.setState({turn: Turns.DefenderLater}, completeMove);
        }
      }
    } /* this.state.turn = Turns.DefenderLater */ else {
      const nodeGuardCounter = new Map();
      this.nodesMap.forEach((node, node_id) => {
        nodeGuardCounter.set(
          node_id,
          this.nodesMap.get(node_id).ref.state.isGuardPresent ? 1 : 0,
        );
      });
      this.edgesMap.forEach((edge, edge_id) => {
        let [node1, node2] = edge_id.split(';');
        if (edge.state.moveGuard1) {
          nodeGuardCounter.set(node1, nodeGuardCounter.get(node1) - 1);
          nodeGuardCounter.set(node2, nodeGuardCounter.get(node2) + 1);
        }
        if (edge.state.moveGuard2) {
          nodeGuardCounter.set(node1, nodeGuardCounter.get(node1) + 1);
          nodeGuardCounter.set(node2, nodeGuardCounter.get(node2) - 1);
        }
      });

      let good = true;
      nodeGuardCounter.forEach((value, node_id) => {
        if (value < 0 || value > 1) {
          good = false;
        }
      });

      if (good) {
        // Saving momento.
        if (this.props.mode !== Modes.AutoDefender && !calledByRedo) {
          this.saveMomento();
        }

        let wasCovered = false;
        const guardExistsSet = new Set();
        const moveGuard = (edge, node1, node2) => {
          if (edge === this.attackedEdge) {
            wasCovered = true;
          }
          if (!guardExistsSet.has(node1)) {
            this.nodesMap.get(node1).ref.setState({isGuardPresent: false});
          }
          this.nodesMap.get(node2).ref.setState({isGuardPresent: true});
          guardExistsSet.add(node2);
        };
        this.edgesMap.forEach((edge, edge_id) => {
          const [node1, node2] = edge_id.split(';');
          if (edge.state.moveGuard1) {
            moveGuard(edge, node1, node2, guardExistsSet);
          }
          if (edge.state.moveGuard2) {
            moveGuard(edge, node2, node1, guardExistsSet);
          }
        });
        const [attackedNode1, attackedNode2] =
          this.attackedEdge.props.id.split(';');
        if (
          (!this.nodesMap.get(attackedNode1).ref.state.isGuardPresent &&
            !this.nodesMap.get(attackedNode2).ref.state.isGuardPresent) ||
          !wasCovered
        ) {
          this.finishGame(Winner.Attacker);
        } else {
          this.resetEdges();
          let completeMove = () => {
            this.attackedEdge = undefined;
          };
          if (this.props.mode === Modes.AutoAttacker) {
            this.moves--;
            completeMove = () => {
              if (this.moves === 0) {
                this.finishGame(Winner.Defender);
              } else {
                this.guards = [];
                this.nodesMap.forEach(element => {
                  if (element.ref.state.isGuardPresent) {
                    this.guards.push(parseInt(element.ref.props.id));
                  }
                });
                const toAttack = this.moveMap.get(
                  tupleToString(this.guards) + ';' + this.moves,
                )[0];
                this.attackedEdge = this.edgesMap.get(
                  this.edgeList[toAttack][0] + ';' + this.edgeList[toAttack][1],
                );
                this.onEdgePress(this.attackedEdge);
                this.moves--;
                this.changeTurn();
              }
            };
          } else if (this.props.mode === Modes.AutoDefender) {
            this.moves--;
          }
          this.setState({turn: Turns.Attacker}, completeMove);
        }
      } else {
        this.setState({warning: 'Invalid move, try again.'});
      }
    }
  };

  onEdgePress = edge => {
    if (this.state.isLoading) {
      return;
    }
    if (this.state.turn === Turns.Attacker) {
      if (this.attackedEdge) {
        this.attackedEdge.setState({isAttacked: false});
      }
      this.attackedEdge = edge;
      edge.setState({isAttacked: true});
    } else if (
      this.state.turn === Turns.DefenderLater &&
      this.props.mode !== Modes.AutoDefender
    ) {
      edge.setState({moveGuard1: false, moveGuard2: false});
    }
  };

  showGuard = (node, bySystem) => {
    if (
      !bySystem &&
      (this.state.isLoading || this.props.mode === Modes.AutoDefender)
    ) {
      return;
    }
    if (this.state.turn === Turns.DefenderFirst) {
      if (node.state.isGuardPresent) {
        this.setState({guardCount: this.state.guardCount + 1});
        node.setState({isGuardPresent: false});
      } else {
        this.setState({guardCount: this.state.guardCount - 1});
        node.setState({isGuardPresent: true});
      }
    } else if (this.state.turn === Turns.DefenderLater) {
      if (this.selected) {
        if (
          this.nodesMap
            .get(this.selected.props.id)
            .neighbours.includes(node.props.id)
        ) {
          const edgeId = this.selected.props.id + ';' + node.props.id;
          if (this.edgesMap.has(edgeId)) {
            this.edgesMap.get(edgeId).setState({moveGuard1: true});
          } else {
            this.edgesMap
              .get(node.props.id + ';' + this.selected.props.id)
              .setState({moveGuard2: true});
          }
        }
        this.selected.setState({isSelected: false});
        this.selected = undefined;
      } else if (node.state.isGuardPresent) {
        node.setState({isSelected: true});
        this.selected = node;
      }
    }
  };

  render = () => {
    let buttonTitle = 'Done';
    let headingStyle = [this.styles.heading];
    let headingText = '';
    if (this.state.gameWinner) {
      buttonTitle = 'Restart';
    } else if (this.state.isLoading) {
      headingText = 'Loading... Please Wait';
      this.heading = <Text style={headingStyle}>{headingText}</Text>;
    } else {
      switch (this.props.mode) {
        case Modes.AutoAttacker:
          switch (this.state.turn) {
            case Turns.Attacker:
              headingText = "Attacker's Turn";
              break;
            case Turns.DefenderLater:
              headingText = `Your turn | Turns Left: ${(this.moves + 1) / 2}`;
              break;
            case Turns.DefenderFirst:
              headingText = `Guards Left: ${this.state.guardCount}`;
              headingStyle.push({
                color: this.state.guardCount < 0 ? 'red' : 'white',
              });
              break;
            default:
          }
          break;
        case Modes.AutoDefender:
          headingText =
            this.state.turn === Turns.Attacker
              ? `Your turn | Turns Left: ${(this.moves + 1) / 2}`
              : "Defender's Turn";
          break;
        default:
          switch (this.state.turn) {
            case Turns.Attacker:
              headingText = "Attacker's Turn";
              break;
            case Turns.DefenderLater:
              headingText = "Defenders's turn";
              break;
            default:
              headingText = `Guards Left: ${this.state.guardCount}`;
              headingStyle.push({
                color: this.state.guardCount < 0 ? 'red' : 'white',
              });
          }
      }
      this.heading = <Text style={[headingStyle]}>{headingText}</Text>;
    }
    return (
      <View style={this.styles.container}>
        {this.heading}
        <Pressable
          onPressIn={this.undo}
          style={[
            this.styles.undo,
            {display: this.currentMomentoIndex > 0 ? 'flex' : 'none'},
          ]}>
          <Text>Undo</Text>
        </Pressable>
        <Pressable
          onPressIn={this.redo}
          style={[
            this.styles.redo,
            {
              display:
                this.currentMomentoIndex < this.maxMomentoIndex
                  ? 'flex'
                  : 'none',
            },
          ]}>
          <Text>Redo</Text>
        </Pressable>
        <View style={this.styles.container}>
          {this.renderEdges()}
          {this.renderNodes()}
        </View>
        <Text style={this.styles.warning}>{this.state.warning}</Text>
        <Pressable onPressIn={this.onButtonPress} style={this.styles.button}>
          <Text>{buttonTitle}</Text>
        </Pressable>
      </View>
    );
  };

  styles = StyleSheet.create({
    container: {
      flex: -1,
      backgroundColor: 'black',
    },
    heading: {
      alignSelf: 'center',
      fontSize: 20,
      top: 5,
      color: 'white',
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
}
