import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableCircle, TouchableLine} from '.';
import parse from 'dotparser';

export default function GraphPreview({stage, width, height}) {
  let ast = null;
  try {
    ast = parse(stage.graph);
  } catch {
    return null;
  }

  if (!ast) {
    return null;
  }

  const nodes = [];
  const edges = [];
  let maxX = 0;
  let maxY = 0;
  let minX = 1e9;
  let minY = 1e9;

  const children = ast[0].children;
  for (const element of children) {
    if (element.type === 'node_stmt') {
      let [x, y] = element.attr_list[0].eq.split(' ');
      x = parseFloat(x);
      y = parseFloat(y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      nodes.push([x, y]);
    } /* edge */ else {
      edges.push([element.edge_list[0].id, element.edge_list[1].id]);
    }
  }

  maxY += 10;
  maxX += 10;

  const factorX = (width * 0.9) / maxX;
  const factorY = (height * 0.9) / maxY;
  const minXResized = minX * factorX;
  const minYResized = minY * factorY;
  const shiftX = (minXResized + 0.1 * width) / 2 - minXResized;
  const shiftY = (minYResized + 0.1 * height) / 2 - minYResized;

  for (const node of nodes) {
    node[0] = node[0] * factorX + shiftX;
    node[1] = node[1] * factorY + shiftY;
  }

  function renderNodes() {
    return nodes.map(node => (
      <TouchableCircle
        key={node[0] + ' ' + node[1]}
        cx={node[0]}
        cy={node[1]}
        r={10}
        disabled={true}
      />
    ));
  }

  function renderEdges() {
    return edges.map(edge => {
      let [x1, y1] = nodes[edge[0]];
      let [x2, y2] = nodes[edge[1]];
      return (
        <TouchableLine
          key={`${x1} ${y1} ${x2} ${y2}`}
          {...{x1, y1, x2, y2}}
          thickness={10}
          disabled={true}
        />
      );
    });
  }

  const style = {width, height};
  return (
    <View style={style}>
      {renderEdges()}
      {renderNodes()}
    </View>
  );
}
