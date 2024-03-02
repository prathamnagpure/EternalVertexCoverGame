import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TouchableCircle from './TouchableCircle';
import TouchableLine from './TouchableLine';
import parse from 'dotparser';

export default function GraphPreview({stage, width, height}) {
  let ast = null;
  try {
    ast = parse(stage.graph);
  } catch {
    return false;
  }

  if (!ast) {
    return false;
  }
  const nodes = [];
  const edges = [];
  let maxWidth = 0;
  let maxHeight = 0;

  const children = ast[0].children;
  for (const element of children) {
    if (element.type === 'node_stmt') {
      let [x, y] = element.attr_list[0].eq.split(' ');
      x = parseFloat(x);
      y = parseFloat(y);
      maxWidth = Math.max(maxWidth, x);
      maxHeight = Math.max(maxHeight, y);
      nodes.push([x, y]);
    } /* edge */ else {
      edges.push([element.edge_list[0].id, element.edge_list[1].id]);
    }
  }

  maxHeight += 10;
  maxWidth += 10;

  const factorX = width / maxWidth;
  const factorY = height / maxHeight;

  for (let node of nodes) {
    node[0] *= factorX;
    node[1] *= factorY;
  }

  function renderNodes() {
    return nodes.map(node => (
      <TouchableCircle
        x={node[0]}
        y={node[1]}
        radius={5}
        showGuard={() => {}}
      />
    ));
  }

  function renderEdges() {
    return edges.map(edge => {
      let [x1, y1] = nodes[edge[0]];
      let [x2, y2] = nodes[edge[1]];
      return (
        <TouchableLine
          {...{x1, y1, x2, y2}}
          thickness={5}
          onEdgePress={() => {}}
        />
      );
    });
  }

  const style = {width, height};
  return (
    <View style={[styles.container, style]}>
      {renderEdges()}
      {renderNodes()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
  },
});
