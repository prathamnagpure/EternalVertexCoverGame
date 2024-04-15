import {Dimensions} from 'react-native';
import {horizontalScale} from './scaler';

export function givePoints() {
  var rad = horizontalScale(12);
  var edge =
    (horizontalScale(1.7) *
      (Dimensions.get('window').width - 2 * horizontalScale(10) - rad * 20)) /
    9;
  // var vEdge = (horizontalScale(2) * edge) / horizontalScale(1.5);
  var points = [];
  var rows = 10;
  var cols = 10;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (j != 0) {
        points.push([
          points[i * cols + j - 1][0] + edge + rad,
          points[i * cols + j - 1][1],
        ]);
      } else {
        if (i == 0) {
          points.push([rad + horizontalScale(10), rad + horizontalScale(10)]);
        } else {
          points.push([
            points[(i - 1) * cols + j][0],
            points[(i - 1) * cols + j][1] + edge + rad,
          ]);
        }
      }
    }
  }
  console.log(points);
  const pointsNew = [];
  pointsNew.push(points[0 * 1 + 4]);
  pointsNew.push(points[0 * 0 + 5]);
  pointsNew.push(points[1 * 10 + 2]);
  pointsNew.push(points[1 * 10 + 7]);
  pointsNew.push(points[2 * 10 + 1]);
  pointsNew.push(points[2 * 10 + 8]);
  pointsNew.push(points[3 * 10 + 3]);
  pointsNew.push(points[3 * 10 + 6]);
  pointsNew.push(points[4 * 10 + 0]);
  pointsNew.push(points[4 * 10 + 9]);
  pointsNew.push(points[5 * 10 + 0]);
  pointsNew.push(points[5 * 10 + 9]);
  pointsNew.push(points[6 * 10 + 3]);
  pointsNew.push(points[6 * 10 + 6]);
  pointsNew.push(points[7 * 10 + 1]);
  pointsNew.push(points[7 * 10 + 8]);
  pointsNew.push(points[8 * 10 + 2]);
  pointsNew.push(points[8 * 10 + 7]);
  pointsNew.push(points[9 * 10 + 4]);
  pointsNew.push(points[9 * 10 + 5]);
  return pointsNew;
}
let points = givePoints();
function giveRandomPoints(n, length) {
  const numbers = Array.from({length: length}, (_, index) => [
    Math.random(),
    index,
  ]); // Create an array with numbers from 0 to 23
  const shuffledNumbers = numbers.sort((a, b) => a[0] - b[0]); // Shuffle the array
  return shuffledNumbers.slice(0, n).map(number => number[1]); // Return the first n elements
}
function giveFixedPoints(n, length) {
  if (n === 4) {
    return [6, 7, 12, 13];
  } else if (n === 5) {
    return [4, 14, 18, 17, 5];
  } else if (n === 6) {
    return [2, 3, 8, 9, 14, 15];
  } else if (n === 7) {
    return [0, 8, 18, 6, 7, 12, 13];
  } else if (n === 8) {
    return [0, 3, 9, 15, 18, 16, 8, 2];
  } else if (n === 9) {
    return [0, 3, 9, 15, 18, 16, 8, 2, 10];
  } else if (n === 10) {
    return [0, 3, 9, 15, 18, 16, 8, 2, 10, 12];
  } else {
    return giveRandomPoints(n, length);
  }
}
export default function RandomGraphGenerator(n, e) {
  const adjList = [];
  for (let i = 0; i < n; i++) {
    adjList.push([]);
  }

  const conComp = [];
  conComp.push(0);
  let notCon = [];
  for (let i = 1; i < n; i++) {
    notCon.push(i);
  }

  let eD = 0;
  while (1) {
    if (eD == e) {
      break;
    }
    if (eD < n - 1) {
      const st = giveRandomPoints(1, conComp.length)[0];
      const ne = giveRandomPoints(1, notCon.length)[0];

      console.log(adjList, conComp, notCon, st, ne);
      adjList[conComp[st]].push(notCon[ne]);
      adjList[notCon[ne]].push(conComp[st]);

      conComp.push(notCon[ne]);
      notCon = notCon.filter((value, index) => {
        if (index === ne) {
          return false;
        }
        return true;
      });

      eD++;
    } else {
      const unconnected = [];
      for (let i = 0; i < conComp.length; i++) {
        for (let j = 0; j < conComp.length; j++) {
          if (i < j) {
            if (!adjList[conComp[i]].includes(conComp[j])) {
              unconnected.push([conComp[i], conComp[j]]);
            }
          }
        }
      }

      const edges = giveRandomPoints(e - eD, unconnected.length);
      for (let i = 0; i < edges.length; i++) {
        adjList[unconnected[edges[i]][0]].push(unconnected[edges[i]][1]);
        adjList[unconnected[edges[i]][1]].push(unconnected[edges[i]][0]);
      }
      break;
    }
  }
  return [
    giveFixedPoints(n, points.length).map(value => points[value]),
    adjList,
  ];
}
