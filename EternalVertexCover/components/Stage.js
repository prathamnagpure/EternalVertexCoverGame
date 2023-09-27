import { React, Component } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import TouchableCircle from './TouchableCircle';
import TouchableLine from './TouchableLine';

const turns = {
    defenderFirst: 0,
    defenderLater: 1,
    attacker: 2
}

export default class Stage extends Component{
    constructor(props){
        super(props)
        this.state = {
            guardCount: this.props.stage.guardCount,
            turn: turns.defenderFirst 
        }
        const parse = require('dotparser');
        ast = null;
        try {
            ast = parse(this.props.stage.graph);
        }
        catch {
            return <View />;
        }
        if (!ast) {
            return <View />;
        }
        const children = ast[0].children;
        for (const element of children) {
            if (element.type == 'node_stmt') {
                coordinates = element.attr_list[0].eq.split(' ');
                this.nodes.push({ id: element.node_id.id, pos: { x: parseFloat(coordinates[0]), y: parseFloat(coordinates[1]) } });
            } else {
                this.edges.push([this.nodes[element.edge_list[0].id], this.nodes[element.edge_list[1].id]]);
            }
        }
    }

    nodes = []
    edges = []

    renderNodes = () => {
        return this.nodes.map((node) => {
            return (
                <TouchableCircle
                    key={node.id}
                    x={node.pos.x}
                    y={node.pos.y}
                    radius={30}
                    onPressIn={(change)=>{this.setState({guardCount: this.state.guardCount + change})}}
                />
            )
        }
        );
    };

    renderEdges = () => {
        return this.edges.map((edge) => {
            const [startNode, endNode] = edge;
            return (
                <TouchableLine
                    key={startNode.id + ";" + endNode.id}
                    x1={startNode.pos.x}
                    y1={startNode.pos.y}
                    x2={endNode.pos.x}
                    y2={endNode.pos.y}
                    thickness={10}
                />
            );
        });
    };

    render = () => {
        return (
            <View>
                <Text style={[this.styles.guardsCountText, {color: (this.state.guardCount < 0)? 'red' : 'white'}]}>Guards Left: {this.state.guardCount}</Text>
                {this.renderEdges()}
                {this.renderNodes()}
            </View>
        );
    }

    styles = StyleSheet.create({
        guardsCountText: {
            alignSelf: 'center',
            fontSize: 20,
            top: 5
        }
    });

};