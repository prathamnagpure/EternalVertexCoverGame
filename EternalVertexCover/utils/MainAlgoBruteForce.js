let total = 0;
let current = 0;
let prev = 0;
let p = null;

export function tupleToString(tuple) {
  return tuple.join(',');
}
function check(lis) {
  let set = new Set(lis);
  if (set.size === lis.length) {
    return true;
  }
  return false;
}

function combinations(arr, k) {
  const result = [];
  function generateCombinations(current, start) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      generateCombinations(current, i + 1);
      current.pop();
    }
  }

  generateCombinations([], 0);
  return result;
}

const result = {win: 1, lose: 0, na: 2};
let aMoveMap = new Map();
let dMoveMap = new Map();
function forDefender(guards, adjList, cantGo, cur) {
  let mainList = [];
  if (cur === guards.length) {
    return [[]];
  }

  const nodesToGo = [guards[cur]];
  adjList[guards[cur]].forEach(element => {
    if (cantGo[element] === 0) {
      nodesToGo.push(element);
    }
  });

  const nextCombinations = forDefender(guards, adjList, cantGo, cur + 1);

  nodesToGo.forEach(element => {
    nextCombinations.forEach(element2 => {
      let temp = [element].concat(element2);
      if (check(temp)) {
        mainList.push(temp);
      }
    });
  });

  return mainList;
}

function mainAlgo(turn, guards, attackedge, adjList, edgList, curMove) {
  let fin = 0;
  let pura = result.na;
  let probMax = 0;
  let cnt = 0;
  let minMoves = 100;
  let minMoves2 = 100;
  let mxMoves = 0;
  if (turn === 1) {
    //console.log("Attacker");
    if (curMove === 0) {
      aMoveMap.set(tupleToString(guards) + ';' + curMove, [
        0,
        0,
        1,
        result.lose,
        1,
      ]);
      return [0, 0, 1, result.lose, 1];
    }

    let aWin = 0;
    let aLose = 0;
    let winEdge;
    let puraEdge;
    if (aMoveMap.get(tupleToString(guards) + ';' + curMove) === undefined) {
      if (p) {
        ++current;
        const newPercentage = Math.floor((current * 100) / total);
        if (newPercentage !== prev) {
          prev = newPercentage;
          p?.(Math.min(newPercentage, 99));
        }
      }
      //console.log("not HIT");
      //console.log(aMoveMap);
      let countt = 0;
      edgList.forEach((element, index) => {
        let [_, tempdWin, tempdLose, tempPura, moves] = mainAlgo(
          0,
          guards,
          index,
          adjList,
          edgList,
          curMove - 1,
        );
        let [node1, node2] = element;
        let pos1 = guards.indexOf(node1);
        let pos2 = guards.indexOf(node2);
        if (!(pos1 != -1 && pos2 != -1)) {
          countt++;
          aWin += tempdLose;
          aLose += tempdWin;
          if (true) {
            if (tempPura === result.lose && minMoves >= moves + 1) {
              pura = result.win;
              fin = 1;
              winEdge = index;
              minMoves = Math.min(minMoves, moves + 1);
            } else if (tempPura === result.win) {
              cnt += 1;
              if (mxMoves <= moves + 1) {
                puraEdge = index;
                mxMoves = moves + 1;
              }
            } else {
              if (tempdLose / (tempdLose + tempdWin) >= probMax) {
                puraEdge = index;
                probMax = tempdLose / (tempdLose + tempdWin);
              }
            }
          }
        }
      });
      if (cnt === countt) {
        pura = result.lose;
      }
      if (pura === result.lose) {
        aMoveMap.set(tupleToString(guards) + ';' + curMove, [
          puraEdge,
          aWin,
          aLose,
          pura,
          mxMoves,
        ]);
      } else if (pura === result.win) {
        aMoveMap.set(tupleToString(guards) + ';' + curMove, [
          winEdge,
          aWin,
          aLose,
          pura,
          minMoves,
        ]);
      } else {
        aMoveMap.set(tupleToString(guards) + ';' + curMove, [
          puraEdge,
          aWin,
          aLose,
          pura,
          minMoves,
        ]);
      }
    }
    return aMoveMap.get(tupleToString(guards) + ';' + curMove);
  } else {
    //console.log("defender");
    if (
      dMoveMap.get(tupleToString(guards) + ';' + attackedge + ';' + curMove) !=
      undefined
    ) {
      //console.log("HIT");
      return dMoveMap.get(
        tupleToString(guards) + ';' + attackedge + ';' + curMove,
      );
    }
    let dWin = 0;
    let dLose = 0;
    let winState;
    let puraState;
    let [node1, node2] = edgList[attackedge];
    let pos1 = guards.indexOf(node1);
    let pos2 = guards.indexOf(node2);
    let guardsCopy = [];
    let retPosits = [];
    let cantgo = [];
    for (let i = 0; i < adjList.length; i += 1) {
      cantgo.push(0);
    }
    if (pos1 === -1) {
      //console.log("no guard on left");
      if (pos2 === -1) {
        //console.log("no guard on right");
        dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
          guards,
          0,
          1,
          result.lose,
          1,
        ]);
        return [guards, 0, 1, result.lose, 1];
      } else {
        cantgo[node1] = 1;
        cantgo[node2] = 0;

        guards.forEach(element => {
          if (element != node2) {
            guardsCopy.push(element);
          }
        });
        retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {
          return element.concat([node1]);
        });
        //console.log("postions' returned ");
      }
    } else {
      if (pos2 === -1) {
        //console.log("no guard on right");
        cantgo[node1] = 0;
        cantgo[node2] = 1;

        guards.forEach(element => {
          if (element != node1) {
            guardsCopy.push(element);
          }
        });

        retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {
          return element.concat([node2]);
        });
        //console.log("postions' returned ");
      } else {
        cantgo[node1] = 1;
        cantgo[node2] = 1;

        //console.log("guards on both ");
        guards.forEach(element => {
          if (element != node1 && element != node2) {
            guardsCopy.push(element);
          }
        });

        retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {
          return element.concat([node2, node1]);
        });
        //console.log("postions' returned ");
        cantgo[node2] = 0;
        adjList[node1].forEach(element => {
          if (cantgo[element] === 0) {
            cantgo[element] = 1;
            retPosits = retPosits.concat(
              forDefender(guardsCopy, adjList, cantgo, 0).map(element2 => {
                return element2.concat([element, node1]);
              }),
            );
            cantgo[element] = 0;
          }
        });
        //console.log("postions' after concat ");
        cantgo[node1] = 0;
        cantgo[node2] = 1;
        adjList[node2].forEach(element => {
          if (cantgo[element] === 0) {
            cantgo[element] = 1;
            retPosits = retPosits.concat(
              forDefender(guardsCopy, adjList, cantgo, 0).map(element2 => {
                return element2.concat([element, node2]);
              }),
            );
            cantgo[element] = 0;
          }
        });
        //console.log("postions' after concat ");
      }
    }
    retPosits = retPosits.filter(ele => check(ele)).map(ele => ele.sort());
    retPosits.forEach(element => {
      let [_, tempaWin, tempaLose, tempPura, Moves] = mainAlgo(
        1,
        element,
        undefined,
        adjList,
        edgList,
        curMove - 1,
      );
      dWin += tempaLose;
      dLose += tempaWin;
      if (true) {
        if (tempPura === result.lose && minMoves <= Moves + 1) {
          pura = result.win;
          fin = 1;
          winState = element;
          minMoves = Math.min(Moves + 1, minMoves);
        } else if (tempPura === result.win) {
          cnt += 1;
          if (minMoves2 >= Moves + 1) {
            puraState = element;
          }
          minMoves2 = Math.max(minMoves2, Moves + 1);
        } else {
          if (tempaLose / (tempaLose + tempaWin) >= probMax) {
            puraState = element;
            probMax = tempaLose / (tempaLose + tempaWin);
          }
        }
      }
    });
    //console.log("returned positions ");

    if (cnt === retPosits.length) {
      pura = result.lose;
    }

    if (pura === result.lose) {
      dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
        puraState,
        dWin,
        dLose,
        pura,
        minMoves2,
      ]);
    } else if (pura === result.win) {
      dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
        winState,
        dWin,
        dLose,
        pura,
        minMoves,
      ]);
    } else {
      dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
        puraState,
        dWin,
        dLose,
        pura,
        minMoves,
      ]);
    }
    return dMoveMap.get(
      tupleToString(guards) + ';' + attackedge + ';' + curMove,
    );
  }
}

export function giveMap(guardNum, adjList, edgList, moves, progress) {
  let c = [];
  c[0] = 1;
  for (let k = 0; k < guardNum; ++k) {
    c[k + 1] = (c[k] * (adjList.length - k)) / (k + 1);
  }
  current = 0;
  prev = 0;
  total = c[guardNum] * moves;
  p = progress;

  aMoveMap = new Map();
  dMoveMap = new Map();
  let tempArr = [];
  for (let i = 0; i < adjList.length; i++) {
    tempArr.push(i);
  }

  combinations(tempArr, guardNum).map(value => {
    mainAlgo(1, value, undefined, adjList, edgList, moves);
  });
  return aMoveMap;
}
