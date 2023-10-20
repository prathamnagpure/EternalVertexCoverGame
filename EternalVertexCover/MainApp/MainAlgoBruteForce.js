export function tupleToString(tuple) {
  //console.log("inside tuple func");
  //console.log(tuple);
  return tuple.join(',');
}
function check(lis)
{
 let set = new Set(lis);
 if(set.size == lis.length)
  return true;

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

// //console.log(kCombinations);

const result = {win: 1, lose: 0, na: 2};
let aMoveMap = new Map();
let dMoveMap = new Map();
let count  =0 ;
function forDefender(guards, adjList, cantGo, cur) {
  //console.log("inside forDefender");
  //console.log(typeof(cur));
  //console.log(guards, adjList, cantGo, cur);
  let mainList = [];
  if (cur == guards.length) {
    return [[]];
  }

  forDefender(guards, adjList, cantGo, cur + 1).forEach(element2 => {
    let temp = [guards[cur]];
    temp=  temp.concat(element2);

        if(check(temp))
            mainList.push(temp);
  });

  adjList[guards[cur]].forEach(element => {
    if (cantGo[element] == 0) {
      forDefender(guards, adjList, cantGo, cur + 1).forEach(element2 => {
        let temp  = [element].concat(element2);
        if(check(temp))
            mainList.push(temp);
      });
    }
  });

  return mainList;
}

function mainAlgo(turn, guards, attackedge, adjList, edgList,curMove){
  // console.log("mainAlgo");
  // console.log(turn, guards, attackedge, adjList, edgList,curMove);
  let fin = 0;
  let pura = result.na;
  let probMax = 0;
  let cnt = 0;
  let minMoves = 100;
  let minMoves2 = 100; 
  let mxMoves =0;
  if (turn == 1) {
    // console.log("Attacker");
    if(curMove == 0)
    {
      aMoveMap.set(tupleToString(guards)+';'+curMove, [0, 0, 1, result.lose,1]);
      return  [0,0,1,result.lose,1] ;
    }

    let aWin = 0;
    let aLose = 0;
    let winEdge = undefined;
    let puraEdge = undefined;
    if (aMoveMap.get(tupleToString(guards)+';'+curMove) === undefined) {

          // console.log("not HIT");
          //console.log(aMoveMap);
      edgList.forEach((element,index) => {
        let [_,tempdWin, tempdLose, tempPura,moves] = mainAlgo(
          0,
          guards,
          index,
          adjList,
          edgList,
          curMove-1,
        );
        aWin += tempdLose;
        aLose += tempdWin;
        if (true) {
          if (tempPura == result.lose && minMoves>= moves +1 ) {
            pura = result.win;
            fin = 1;
            winEdge = index;
            minMoves = Math.min(minMoves,moves+1);
          } else if (tempPura == result.win) {
            cnt+=1;
            if(mxMoves<=moves+1)
            {
              puraEdge=index;
              mxMoves=moves+1;
            }
          } else {
            if ((tempdLose / (tempdLose + tempdWin)) >= probMax) {
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
        aMoveMap.set(tupleToString(guards)+';'+curMove, [puraEdge, aWin, aLose, pura,mxMoves]);
      } else if (pura == result.win) {
        aMoveMap.set(tupleToString(guards)+';'+curMove, [winEdge, aWin, aLose, pura,minMoves]);
      } else {
        aMoveMap.set(tupleToString(guards)+';'+curMove, [puraEdge, aWin, aLose, pura,minMoves]);
      }
      
    } 
    return aMoveMap.get(tupleToString(guards)+';'+curMove);
  }else {
    //console.log("defender");
    if(dMoveMap.get(tupleToString(guards)+';'+attackedge)!= undefined)
        {
          // console.log("HIT");
          return dMoveMap.get(tupleToString(guards)+';'+attackedge);
        }

      
      let dWin = 0;
      let dLose = 0;
      let winState = undefined;
      let puraState = undefined;
      let [node1, node2] = edgList[attackedge];
      let pos1 = guards.indexOf(node1);
      let pos2 = guards.indexOf(node2);
      //console.log(pos1+" this is the value ");
      //console.log(pos2+" this is the value ");
      let guardsCopy = [];
      let retPosits = [];
      let cantgo = [];
      for (let i = 0; i < adjList.length; i+=1) cantgo.push(0);


      if (pos1 == -1) {
        //console.log("no guard on left");
        if (pos2 == -1) {
        //console.log("no guard on right");
        dMoveMap.set(tupleToString(guards)+';'+attackedge, [guards,0 , 1, result.lose,1]);

          return [guards,0, 1, result.lose,1];
        } else {
          cantgo[node1] = 1;
          cantgo[node2] = 0;

          guards.forEach(element => {
            if (element != node2) {
              guardsCopy.push(element);
            }
          });
          

          retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {return element.concat([node1])});
          //console.log("postions' returned ");
            //console.log(retPosits);
        }
      } else {
        



        if (pos2 == -1) {
        //console.log("no guard on right");
          cantgo[node1] = 0;
          cantgo[node2] = 1;

          guards.forEach(element => {
            if (element != node1) {
              guardsCopy.push(element);
            }
          });

          retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {return element.concat([node2])});
          //console.log("postions' returned ");
          //console.log(retPosits);

        } else {
          cantgo[node1] = 1;
          cantgo[node2] = 1;

          //console.log("guards on both ");
          guards.forEach(element => {
            if (element != node1 && element != node2) {
              guardsCopy.push(element);
            }
          });

          retPosits = forDefender(guardsCopy, adjList, cantgo, 0).map(element => {return element.concat([node2,node1])});
          //console.log("postions' returned ");
          //console.log(retPosits);


          cantgo[node2] = 0;
          adjList[node1].forEach(element => {
            if (cantgo[element] == 0) {
              cantgo[element] = 1;
              retPosits=retPosits.concat(forDefender(guardsCopy, adjList, cantgo, 0).map(element2 => {return element2.concat([element,node1])})
);
            }
          });
          //console.log("postions' after concat ");
          //console.log(retPosits);

          cantgo[node1] = 0;
          cantgo[node2] = 1;
          adjList[node2].forEach(element => {
            if (cantgo[element] == 0) {
              cantgo[element] = 1;
              retPosits=retPosits.concat(forDefender(guardsCopy, adjList, cantgo, 0).map(element2 =>{return element2.concat([element,node2])}));
            }
          });
          //console.log("postions' after concat ");
          //console.log(retPosits);
        }

      }
        retPosits.forEach(element => {
          //console.log("yaha pe");
          //console.log(element);
          let [_, tempaWin, tempaLose, tempPura, Moves] = mainAlgo(
            1,
            element,
            undefined,
            adjList,
            edgList,
            curMove-1,
          );
          dWin+=tempaLose;
          dLose+=tempaWin;
          if(true )
          {
          if(tempPura == result.lose && minMoves <= Moves + 1 )
          {
            pura = result.win;
            fin = 1;
            winState = element;
            minMoves= Math.min(Moves+1,minMoves);
          }
          else if( tempPura == result.win)
          {
            cnt +=1;
            if(minMoves2>= Moves +1)
            puraState = element; 

            minMoves2 = Math.max(minMoves2,Moves+1);
          }
          else
          {
            if ((tempaLose / (tempaLose + tempaWin)) >= probMax) {
              puraState = element;
              probMax = tempaLose / (tempaLose + tempaWin);
            }

          }
        }
       

        });
        //console.log("returned positions ");
        //console.log(retPosits);

        if (cnt == retPosits.length) {
          pura = result.lose;
        }

        if (pura == result.lose) {
          dMoveMap.set(tupleToString(guards)+';'+attackedge+';'+curMove, [puraState, dWin, dLose, pura,minMoves2]);
        } else if (pura == result.win) {
          dMoveMap.set(tupleToString(guards)+';'+attackedge+';'+curMove, [winState, dWin, dLose, pura,minMoves]);
        } else {
          dMoveMap.set(tupleToString(guards)+';'+attackedge+';'+curMove, [puraState, dWin, dLose, pura, minMoves]);
        }
        return dMoveMap.get(tupleToString(guards)+';'+attackedge+';'+curMove);
    }
};

export function giveMap(guardNum,adjList,edgList,moves){

  ////console.log(mainAlgo(1,[1,2],undefined,[[1],[0,2],[1,3],[2]],[[0,1],[1,2],[2,3]]));
  aMoveMap = new Map();
  dMoveMap = new Map();
  console.log(guardNum,adjList,edgList,moves);
  let tempArr = [];
  for(let i =0 ; i < adjList.length;i++)
  {
    tempArr.push(i);
  }

  for(let i=1;i<=guardNum;i++){
  combinations(tempArr,i).map(value => {
//    2 [[1], [0, 2], [1, 3], [2]] [[0, 1], [1, 2], [2, 3]] 6
  // console.log(value);
  // console.log();
  mainAlgo(1,value,undefined,adjList,edgList,moves);
  console.log("Done this ",value);
  // console.log(mainAlgo(1,value,undefined,[[1],[0]],[[0,1]],4));
  })}
  // console.log(aMoveMap);
  // console.log(dMoveMap);
  return aMoveMap;
  //console.log(forDefender([1,2],[[1],[0,2],[1,3],[2]],[0,0,0,0],0));
  //console.log(combinations([0,1,2,3],1));
  //console.log(combinations([0,1,2,3],2));
}
