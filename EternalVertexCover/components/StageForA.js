import {React, Component} from 'react';
import {View, Pressable, StyleSheet, Text, Button, Alert} from 'react-native';
import TouchableCircle from './TouchableCircle';
import TouchableLine from './TouchableLine';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {giveMap, tupleToString} from '../MainApp/MainAlgoBruteForce';

const turns = {
  defenderFirst: 0,
  defenderLater: 1,
  attacker: 2,
};

export default class StageForA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guardCount: this.props.stage.guardCount,
      turn: turns.defenderFirst,
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
        this.edgeList.push([element.edge_list[0].id, element.edge_list[1].id]);
        this.nodesMap
          .get(String(element.edge_list[0].id))
          .neighbours.push(String(element.edge_list[1].id));
        this.nodesMap
          .get(String(element.edge_list[1].id))
          .neighbours.push(String(element.edge_list[0].id));
      }
    }
    this.nodes.forEach(element => {
      this.adjList.push([]);
    });
    this.edgeList.forEach(element => {
      this.adjList[element[0]].push(element[1]);
      this.adjList[element[1]].push(element[0]);
    });
  }

  nodes = [];
  edges = [];
  edgeList = [];
  nodesMap = new Map();
  edgesMap = new Map();
  algoEdgeMap = new Map();
  numNodes = 0;
  aMoveMap = undefined;
  adjList = [];
  guards = [];
  moves = this.props.stage.moves;
  guardNum = this.props.stage.guardCount;
  //guardNum,adjList,edgList,moves

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
          thickness={10}
          onEdgePress={this.onEdgePress}
          ref={ref => this.edgesMap.set(startNode.id + ';' + endNode.id, ref)}
        />
      );
    });
  };

  changeTurn = () => {
    console.log('change turn is called .' + this.moves);
    if (this.state.turn === turns.defenderFirst) {
      if (this.state.guardCount === 0) {
        // Alert.alert("change turn inside dfender first  ."+this.moves);
        this.setState({turn: turns.attacker}, () => {
          this.guards = [];
          this.nodesMap.forEach(element => {
            if (element.ref.state.guardPresent) {
              this.guards.push(parseInt(element.ref.props.id));
            }
          });
          if (this.aMoveMap == undefined) {
            // Alert.alert("before called "+this.moves);
            this.aMoveMap = giveMap(
              this.guardNum,
              this.adjList,
              this.edgeList,
              this.moves,
            );
            // Alert.alert("after called "+this.moves);
          }

          console.log(this.aMoveMap);
          console.log(
            tupleToString(this.guards) + ';' + this.moves + 'hueuheh',
          );
          // Alert.alert("getting from map ");
          while (this.aMoveMap == undefined) {}
          let toAttack = this.aMoveMap.get(
            tupleToString(this.guards) + ';' + this.moves,
          )[0];
          this.attackedEdge = this.edgesMap.get(
            this.edgeList[toAttack][0] + ';' + this.edgeList[toAttack][1],
          );
          this.onEdgePress(this.attackedEdge);
          this.moves--;
          this.changeTurn();
        });
      } else {
        Alert.alert('Guards left should be 0');
      }
    } else if (this.state.turn === turns.attacker) {
      // Alert.alert("insdie attacker");
      if (this.attackedEdge === undefined) {
        Alert.alert('You have to attack an edge');
      } else {
        let [node1, node2] = this.attackedEdge.props.id.split(';');
        if (
          !this.nodesMap.get(node1).ref.state.guardPresent &&
          !this.nodesMap.get(node2).ref.state.guardPresent
        ) {
          Alert.alert('Game over: Attacker Won');
        } else {
          this.setState({turn: turns.defenderLater});
        }
      }
    } else {
      // Alert.alert("inside defender later ");
      let nodeGuardCounter = new Map();
      this.nodesMap.forEach((node, node_id) => {
        nodeGuardCounter.set(
          node_id,
          this.nodesMap.get(node_id).ref.state.guardPresent ? 1 : 0,
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
        console.log(nodeGuardCounter);
      });

      let good = true;
      nodeGuardCounter.forEach((value, node_id) => {
        if (value < 0 || value > 1) {
          good = false;
        }
      });

      if (good) {
        this.edgesMap.forEach((edge, edge_id) => {
          let [node1, node2] = edge_id.split(';');
          if (edge.state.moveGuard1) {
            this.nodesMap.get(node1).ref.setState({guardPresent: false});
            this.nodesMap.get(node2).ref.setState({guardPresent: true});
            if (edge.state.moveGuard2) {
              this.nodesMap.get(node1).ref.setState({guardPresent: true});
            }
          } else if (edge.state.moveGuard2) {
            this.nodesMap.get(node2).ref.setState({guardPresent: false});
            this.nodesMap.get(node1).ref.setState({guardPresent: true});
          }
        });
        let [attackedNode1, attackedNode2] =
          this.attackedEdge.props.id.split(';');
        if (
          !this.nodesMap.get(attackedNode1).ref.state.guardPresent &&
          !this.nodesMap.get(attackedNode2).ref.state.guardPresent
        ) {
          Alert.alert('Game Over, Attacker Won');
        } else {
          this.moves--;
          this.edgesMap.forEach((edge, edge_id) => {
            edge.setState({
              moveGuard1: false,
              moveGuard2: false,
              isAttacked: false,
            });
          });
          this.setState({turn: turns.attacker}, () => {
            if (this.moves == 0) {
              Alert.alert('Game Over, Attacker Won');
            } else {
              this.guards = [];
              this.nodesMap.forEach(element => {
                if (element.ref.state.guardPresent) {
                  this.guards.push(parseInt(element.ref.props.id));
                }
              });

              console.log(this.aMoveMap);
              console.log(
                tupleToString(this.guards) + ';' + this.moves + 'hueuheh',
              );
              let toAttack = this.aMoveMap.get(
                tupleToString(this.guards) + ';' + this.moves,
              )[0];
              this.attackedEdge = this.edgesMap.get(
                this.edgeList[toAttack][0] + ';' + this.edgeList[toAttack][1],
              );
              this.onEdgePress(this.attackedEdge);
              this.moves--;
              this.changeTurn();
            }
          });
        }
      }
    }
  };

  attackedEdge = undefined;

  onEdgePress = edge => {
    if (this.state.turn === turns.attacker) {
      if (this.attackedEdge) {
        this.attackedEdge.setState({isAttacked: false});
      }
      this.attackedEdge = edge;
      edge.setState({isAttacked: true});
    } else if (this.state.turn === turns.defenderLater) {
      edge.setState({moveGuard1: false, moveGuard2: false});
    }
  };

  showGuard = node => {
    if (this.state.turn === turns.defenderFirst) {
      if (node.state.guardPresent) {
        node.setState({guardPresent: false});
        this.setState({guardCount: this.state.guardCount + 1});
      } else {
        node.setState({guardPresent: true});
        this.setState({guardCount: this.state.guardCount - 1});
      }
    } else if (this.state.turn === turns.defenderLater) {
      if (this.selected) {
        if (
          this.nodesMap
            .get(this.selected.props.id)
            .neighbours.includes(node.props.id)
        ) {
          let edgeId = this.selected.props.id + ';' + node.props.id;
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
      } else if (node.state.guardPresent) {
        node.setState({isSelected: true});
        this.selected = node;
      }
    }
  };

  selected = undefined;

  render = () => {
    let heading = (
      <Text
        style={[
          this.styles.heading,
          {color: this.state.guardCount < 0 ? 'red' : 'white'},
        ]}>
        Guards Left: {this.state.guardCount}
      </Text>
    );
    if (this.state.turn === turns.attacker) {
      heading = <Text style={this.styles.heading}>Attacker's turn</Text>;
    } else if (this.state.turn === turns.defenderLater) {
      heading = <Text style={this.styles.heading}>Defenders's turn</Text>;
    }
    return (
      <View style={this.styles.container}>
        {heading}
        <View>
          {this.renderEdges()}
          {this.renderNodes()}
        </View>
        <Pressable
          onPressIn={this.changeTurn}
          title="Done"
          style={this.styles.button}>
          <Text>Done</Text>
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
    },
    button: {
      backgroundColor: 'grey',
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 550,
      width: 100,
      alignSelf: 'center',
    },
  });
}
