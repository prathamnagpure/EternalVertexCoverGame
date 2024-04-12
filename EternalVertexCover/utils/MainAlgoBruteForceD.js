export function tupleToString(tuple) {
  //console.log("inside tuple func");
  //console.log(tuple);
  const array = [...tuple];

  // Step 2: Sort the array
  array.sort((a, b) => a - b);

  // Step 3 (optional): Convert the sorted array back to a tuple
  const sortedTuple = [...array];
  return sortedTuple.join(',');
}
function check(lis) {
  let set = new Set(lis);
  if (set.size == lis.length) {
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

// const pNumbers = [1, 2, 3, 4];
// const k = 2;
// const kCombinations = combinations(pNumbers, k);

//console.log(kCombinations);

const result = {win: 1, lose: 0, na: 2};
let aMoveMap = new Map();
let dMoveMap = new Map();
let count = 0;
function forDefender(guards, adjList, cantGo, cur) {
  //console.log("inside forDefender");
  //console.log(typeof(cur));
  //console.log(guards, adjList, cantGo, cur);
  let mainList = [];
  if (cur == guards.length) {
    return [[[], []]];
  }

  forDefender(guards, adjList, cantGo, cur + 1).forEach(element2 => {
    let temp = [guards[cur]];
    temp = temp.concat(element2[0]);
    let temp2 = [cur];
    temp2 = temp2.concat(element2[1]);

    if (check(temp)) {
      mainList.push([temp, temp2]);
    }
  });
  adjList[guards[cur]].forEach(element => {
    if (cantGo[element] == 0) {
      forDefender(guards, adjList, cantGo, cur + 1).forEach(element2 => {
        let temp = [element];
        temp = temp.concat(element2[0]);
        let temp2 = [cur];
        temp2 = temp2.concat(element2[1]);

        if (check(temp)) {
          mainList.push([temp, temp2]);
        }
      });
    }
  });

  return mainList;
}

export function mainAlgo(turn, guards, attackedge, adjList, edgList, curMove) {
  //console.log("mainAlgo");
  //console.log(turn, guards, attackedge, adjList, edgList,curMove);
  let fin = 0;
  let pura = result.na;
  let probMax = 0;
  let cnt = 0;
  let minMoves = 100;
  let minMoves2 = 100;
  let mxMoves = 0;
  if (turn == 1) {
    //console.log("Attacker");
    if (curMove == 0) {
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
      //console.log("not HIT");
      //console.log(aMoveMap);
      edgList.forEach((element, index) => {
        let [_, tempdWin, tempdLose, tempPura, moves, __] = mainAlgo(
          0,
          guards,
          index,
          adjList,
          edgList,
          curMove - 1,
        );
        aWin += tempdLose;
        aLose += tempdWin;
        if (true) {
          if (tempPura == result.lose && minMoves >= moves + 1) {
            pura = result.win;
            fin = 1;
            winEdge = index;
            minMoves = Math.min(minMoves, moves + 1);
          } else if (tempPura == result.win) {
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
      });
      if (cnt == edgList.length) {
        pura = result.lose;
      }
      if (pura == result.lose) {
        aMoveMap.set(tupleToString(guards) + ';' + curMove, [
          puraEdge,
          aWin,
          aLose,
          pura,
          mxMoves,
        ]);
      } else if (pura == result.win) {
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
    let retPosits = [];
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
    let winWhere;
    let puraWhere;
    let [node1, node2] = edgList[attackedge];
    let pos1 = guards.indexOf(node1);
    let pos2 = guards.indexOf(node2);
    //console.log(pos1+" this is the value ");
    //console.log(pos2+" this is the value ");
    let guardMp = new Map();
    let guardsCopy = [];
    let cantgo = [];
    let uu = 0;
    for (let i = 0; i < adjList.length; i += 1) {
      cantgo.push(0);
    }

    const array = [...guards];

    // Step 2: Sort the array
    array.sort((a, b) => a - b);

    // Step 3 (optional): Convert the sorted array back to a tuple
    const sortedTuple = [...array];

    if (pos1 == -1) {
      //console.log("no guard on left");
      if (pos2 == -1) {
        //console.log("no guard on right");
        for (let i = 0; i < guards.length; i += 1) {
          retPosits.push(i);
        }

        dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
          guards,
          0,
          1,
          result.lose,
          1,
          retPosits,
        ]);

        return [guards, 0, 1, result.lose, 1, retPosits];
      } else {
        if (curMove == 0) {
          for (let i = 0; i < guards.length; i += 1) {
            retPosits.push(i);
          }
          let newpuraWhere = retPosits.map((element, index) => {
            var guardElem = guards[element];
            var newPos = sortedTuple.indexOf(guardElem);
            return newPos;
          });

          dMoveMap.set(
            tupleToString(guards) + ';' + attackedge + ';' + curMove,
            [guards, 1, 0, result.win, 1, newpuraWhere],
          );
          return dMoveMap.get(
            tupleToString(guards) + ';' + attackedge + ';' + curMove,
          );
        }
        cantgo[node1] = 1;
        cantgo[node2] = 0;

        guards.forEach((element, index) => {
          if (element != node2) {
            guardsCopy.push(element);
            guardMp.set(uu, index);
            uu++;
          }
        });

        retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {
          return [
            element[0].concat([node1]),
            element[1]
              .map(elementx => {
                return guardMp.get(elementx);
              })
              .concat([pos2]),
          ];
        });
        //console.log("postions' returned ");
        //console.log(retPosits);
      }
    } else {
      if (curMove == 0) {
        for (let i = 0; i < guards.length; i += 1) {
          retPosits.push(i);
        }
        let newpuraWhere = retPosits.map((element, index) => {
          var guardElem = guards[element];
          var newPos = sortedTuple.indexOf(guardElem);
          return newPos;
        });

        dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
          guards,
          1,
          0,
          result.win,
          1,
          newpuraWhere,
        ]);
        return dMoveMap.get(
          tupleToString(guards) + ';' + attackedge + ';' + curMove,
        );
      }

      if (pos2 == -1) {
        //console.log("no guard on right");
        cantgo[node1] = 0;
        cantgo[node2] = 1;

        guards.forEach((element, index) => {
          if (element != node1) {
            guardsCopy.push(element);
            guardMp.set(uu, index);
            uu++;
          }
        });

        retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {
          return [
            element[0].concat([node2]),
            element[1]
              .map(elementx => {
                return guardMp.get(elementx);
              })
              .concat([pos1]),
          ];
        });
        //console.log("postions' returned ");
        //console.log(retPosits);
      } else {
        cantgo[node1] = 1;
        cantgo[node2] = 1;

        //console.log("guards on both ");
        guards.forEach((element, index) => {
          if (element != node1 && element != node2) {
            guardsCopy.push(element);
            guardMp.set(uu, index);
            uu++;
          }
        });

        retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {
          return [
            element[0].concat([node2, node1]),
            element[1]
              .map(elementx => {
                return guardMp.get(elementx);
              })
              .concat([pos1, pos2]),
          ];
        });
        //console.log("postions' returned ");
        //console.log(retPosits);

        cantgo[node2] = 0;
        adjList[node1].forEach(element => {
          if (cantgo[element] == 0) {
            cantgo[element] = 1;
            retPosits = retPosits.concat(
              forDefender(guardsCopy, adjList, cantgo, 0).map(element2 => {
                return [
                  element2[0].concat([element, node1]),
                  element2[1]
                    .map(elementx => {
                      return guardMp.get(elementx);
                    })
                    .concat([pos1, pos2]),
                ];
              }),
            );
            cantgo[element] = 0;
          }
        });
        //console.log("postions' after concat ");
        //console.log(retPosits);

        cantgo[node1] = 0;
        cantgo[node2] = 1;
        adjList[node2].forEach(element => {
          if (cantgo[element] == 0) {
            cantgo[element] = 1;
            retPosits = retPosits.concat(
              forDefender(guardsCopy, adjList, cantgo, 0).map(element2 => {
                return [
                  element2[0].concat([element, node2]),
                  element2[1]
                    .map(elementx => {
                      return guardMp.get(elementx);
                    })
                    .concat([pos2, pos1]),
                ];
              }),
            );
            cantgo[element] = 0;
          }
        });
        //console.log("postions' after concat ");
        //console.log(retPosits);
      }
    }
    let countt = 0;
    retPosits.forEach(element => {
      //console.log("yaha pe");
      //console.log(element);
      if (check(element[0])) {
        countt++;
        let [_, tempaWin, tempaLose, tempPura, Moves] = mainAlgo(
          1,
          element[0],
          undefined,
          adjList,
          edgList,
          curMove - 1,
        );
        dWin += tempaLose;
        dLose += tempaWin;
        if (true) {
          if (tempPura == result.lose && minMoves >= Moves + 1) {
            pura = result.win;
            fin = 1;
            winState = element[0];
            winWhere = element[1];
            minMoves = Math.min(Moves + 1, minMoves);
          } else if (tempPura == result.win) {
            cnt += 1;
            if (mxMoves <= Moves + 1) {
              puraState = element[0];
              puraWhere = element[1];
            }
            mxMoves = Math.max(mxMoves, Moves + 1);
          } else {
            if (tempaLose / (tempaLose + tempaWin) >= probMax) {
              puraState = element;
              probMax = tempaLose / (tempaLose + tempaWin);
            }
          }
        }
      }
    });

    //console.log("returned positions ");
    //console.log(retPosits);

    if (cnt == countt) {
      pura = result.lose;
    }

    if (pura == result.lose) {
      let newpuraWhere = puraWhere.map((element, index) => {
        var guardElem = guards[element];
        var newPos = sortedTuple.indexOf(guardElem);
        return newPos;
      });
      dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
        puraState,
        dWin,
        dLose,
        pura,
        mxMoves,
        newpuraWhere,
      ]);
    } else if (pura == result.win) {
      let newwinWhere = winWhere.map((element, index) => {
        var guardElem = guards[element];
        var newPos = sortedTuple.indexOf(guardElem);
        return newPos;
      });
      dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
        winState,
        dWin,
        dLose,
        pura,
        minMoves,
        newwinWhere,
      ]);
    } else {
      dMoveMap.set(tupleToString(guards) + ';' + attackedge + ';' + curMove, [
        puraState,
        dWin,
        dLose,
        pura,
        minMoves,
        puraWhere,
      ]);
    }
    return dMoveMap.get(
      tupleToString(guards) + ';' + attackedge + ';' + curMove,
    );
  }
}

export function giveMap(guardNum, guardPos, adjList, edgList, moves) {
  //console.log(mainAlgo(1,[1,2],undefined,[[1],[0,2],[1,3],[2]],[[0,1],[1,2],[2,3]]));
  console.log(guardNum, guardPos, adjList, edgList, moves);
  aMoveMap = new Map();
  dMoveMap = new Map();
  //console.log(guardNum, adjList, edgList, moves);
  let tempArr = [];
  for (let i = 0; i < edgList.length; i++) {
    tempArr.push(i);
  }
  // adjList = [[1, 3], [2, 3], [1], [0]];

  combinations(tempArr, 1).map(value => {
    // 2 [[1], [0, 2], [1, 3], [2]] [[0, 1], [1, 2], [2, 3]] 6
    //console.log(value);
    //console.log();
    mainAlgo(0, guardPos, value, adjList, edgList, moves);
    //console.log('Done this ', value);
    //console.log(mainAlgo(1,value,undefined,[[1],[0]],[[0,1]],4));
  });
  console.log('aMoveMap');
  console.log(aMoveMap);
  console.log('dMoveMap');
  console.log(dMoveMap);
  return dMoveMap;
  //console.log(forDefender([1,2],[[1],[0,2],[1,3],[2]],[0,0,0,0],0));
  //console.log(combinations([0,1,2,3],1));
  //console.log(combinations([0,1,2,3],2));
}
// giveMap(5,[0,1,3,5,7],[[1,5],[3,2,7,0],[1],[4,1,5],[3],[6,0,1],[5],[1,9,8],[7],[7]],[[0,1],[1,2],[1,3],[3,5],[5,0],[5,6],[3,4],[1,7],[7,9],[7,8]],7);
//console.log(dMoveMap);
//console.log(dMoveMap.get(tupleToString([0,1,3,5,7])+';'+'9'+';'+'7'));
//console.log(dMoveMap.get(tupleToString([1,3,5,7,8])+';'+'8'+';'+5));
//console.log(dMoveMap.get(tupleToString([1,3,5,8,9])+';'+'7'+';'+3));
//console.log(tupleToString([1,2,4,3]));
//console.log(tupleToString([4,3,2,1]));
