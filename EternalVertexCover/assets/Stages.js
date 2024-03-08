import graph2 from './graphs/graph2';
import graph1 from './graphs/graph1';
import graph3 from './graphs/graph3';
import graph4 from './graphs/graph4';
import graph5 from './graphs/graph5';
import graph6 from './graphs/graph6';
import graph7 from './graphs/graph7';
import graph8 from './graphs/graph8';
import graph9 from './graphs/graph9';
import graph10 from './graphs/graph10';
import graph11 from './graphs/graph11';
import graph12 from './graphs/graph12';
import graph13 from './graphs/graph13';
import graph14 from './graphs/graph14';
import graph15 from './graphs/graph15';
import graph16 from './graphs/graph16';
import graph17 from './graphs/graph17';
const stages = [
  {graph: graph1, guardCount: 2, graphNum: 1},
  {graph: graph2, guardCount: 3, graphNum: 2},
  {
    graph: graph3,
    guardCount: 3,
    moves: 6,
    graphNum: 3,
    map: require('./graphMaps/file' + 3 + '.json'),
  },
  {
    graph: graph4,
    guardCount: 3,
    moves: 4,
    graphNum: 4,
    map: require('./graphMaps/file' + 4 + '.json'),
  },
  {
    graph: graph5,
    guardCount: 4,
    moves: 4,
    graphNum: 5,
    map: require('./graphMaps/file' + 5 + '.json'),
  },
  {
    graph: graph6,
    guardCount: 4,
    moves: 4,
    graphNum: 6,
    map: require('./graphMaps/file' + 6 + '.json'),
  },
  {
    graph: graph7,
    guardCount: 4,
    moves: 6,
    graphNum: 7,
    map: require('./graphMaps/file' + 7 + '.json'),
  },
  {
    graph: graph8,
    guardCount: 2,
    moves: 5,
    guards: [1, 2],
    graphNum: 8,
    map: require('./graphMaps/file' + 8 + '.json'),
  },
  {
    graph: graph9,
    guardCount: 4,
    moves: 5,
    guards: [0, 1, 2, 4],
    graphNum: 9,
    map: require('./graphMaps/file' + 9 + '.json'),
  },
  {
    graph: graph10,
    guardCount: 4,
    moves: 5,
    guards: [5, 1, 2, 4],
    graphNum: 10,
    map: require('./graphMaps/file' + 10 + '.json'),
  },
  {
    graph: graph11,
    guardCount: 6,
    moves: 7,
    guards: [5, 1, 2, 4, 6, 8],
    graphNum: 11,
    map: require('./graphMaps/file' + 11 + '.json'),
  },
  {
    graph: graph12,
    guardCount: 5,
    moves: 7,
    guards: [5, 1, 4, 6, 7],
    graphNum: 12,
    map: require('./graphMaps/file' + 12 + '.json'),
  },
  {
    graph: graph13,
    guardCount: 4,
    moves: 5,
    guards: [6, 1, 2, 3],
    graphNum: 13,
    map: require('./graphMaps/file' + 13 + '.json'),
  },
  {
    graph: graph14,
    guardCount: 7,
    moves: 7,
    guards: [0, 1, 4, 5, 12, 10, 8],
    graphNum: 14,
    map: require('./graphMaps/file' + 14 + '.json'),
  },
  {
    graph: graph15,
    guardCount: 4,
    moves: 8,
    guards: [0, 1, 4, 5, 12, 10, 8],
    graphNum: 15,
    map: require('./graphMaps/file' + 15 + '.json'),
  },
  {
    graph: graph16,
    guardCount: 3,
    moves: 6,
    guards: [0, 1, 4, 5, 12, 10, 8],
    graphNum: 16,
    map: require('./graphMaps/file' + 16 + '.json'),
  },
  {
    graph: graph17,
    guardCount: 1,
    moves: 3,
    guards: [1],
    graphNum: 17,
    // map: require('./graphMaps/file' + 17 + '.json'),
  },
  //{graph: graph1, guardCount: 2,graphNum: 1,map:require('./graphMaps/file'+ 1+'.json')},
  //{graph: graph2, guardCount: 3,graphNum: 2,map:require('./graphMaps/file'+ 2+'.json')},
];

export default stages;
