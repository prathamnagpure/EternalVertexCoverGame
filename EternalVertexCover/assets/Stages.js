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
export default stages = [
  {graph: graph1, guardCount: 2},
  {graph: graph2, guardCount: 3},
  {graph: graph3, guardCount: 3, moves:6},
  {graph: graph4, guardCount: 3, moves:4},
  {graph: graph5, guardCount: 4, moves:4},
  {graph: graph6, guardCount: 4, moves:4},
  {graph: graph7, guardCount: 4, moves:4},
  {graph: graph8, guardCount: 2, moves:3,guards:[1,2]},
  {graph: graph9, guardCount: 4, moves:2,guards:[0,1,2,4]},
  {graph: graph10, guardCount: 4, moves:3,guards:[5,1,2,4]},
  {graph: graph11, guardCount: 6, moves:4,guards:[5,1,2,4,6,8]},
  {graph: graph12, guardCount: 5, moves:4,guards:[5,1,4,6,7]},
];
