export {breadthFirstSearch};
import {StateClass, UnitCell2DArray,coordinates,store2DArrayData} from './classes.js';


// REQUIRES: UnitCell2DArray.isStartEndSet() == true &&
//           StateClass.getMode() == 3
async function breadthFirstSearch(STATE: StateClass) {

    // Add colouring for visited nodes
    let boardSize = STATE.getCellArray().getBoardSize();
    let endCell = [-1,-1];

    // Initialization
    let queue : coordinates[] = [];
    let visited= new store2DArrayData(boardSize,false);
    let distance = new store2DArrayData(boardSize,boardSize*boardSize+1);
    
    queue.push(STATE.getCellArray().getStart());
    visited.set(STATE.getCellArray().getStart(),true);
    distance.set(STATE.getCellArray().getStart(),0);

    console.log("queue:");
    console.log(queue);

    // Exploration
    while (queue.length != 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
        let currentCoordinate = queue[0];
        // console.log("Search: ",currentCoordinate[0],currentCoordinate[1]);
        queue.splice(0,1);

        if (STATE.getCellArray().isEnd(currentCoordinate)) {
            // Found end
            distance.set(currentCoordinate,getLeastNeighbourDistance(currentCoordinate,distance,boardSize)+1);
            console.log("found end! at:",currentCoordinate);
            endCell = currentCoordinate;
            break;
        }

        visited.set(currentCoordinate,true);
        let currentDistance = getLeastNeighbourDistance(currentCoordinate,distance,boardSize)+1;
        distance.set(currentCoordinate,currentDistance);
        let color = "hsl(" + ((currentDistance%25)/25)*360 +",100%,50%)";
        STATE.getCellArray().getCell(currentCoordinate).getElement().style.backgroundColor = color;

        let neighbours = [[currentCoordinate[0]-1,currentCoordinate[1]],  // West
                          [currentCoordinate[0],currentCoordinate[1]+1],  // North
                          [currentCoordinate[0]+1,currentCoordinate[1]],  // ..
                          [currentCoordinate[0],currentCoordinate[1]-1]]
        for (let i = 0; i < neighbours.length; i++) {
            let coord = neighbours[i];
            // Check if the coordinates are outside the board
            if (coord[0]<0 || coord[1]<0 || coord[0]>=boardSize || coord[1]>=boardSize) {
                continue;
            }

            // Check if visited
            if (visited.get([coord[0],coord[1]])) {
                continue;
            }

            // Check if already on list to be visited
            if (arrayContains(queue,[coord[0],coord[1]])) {
                continue;
            }

            // check if the coordinates containe a wall cell
            if (STATE.getCellArray().isWall([coord[0],coord[1]]) != -1) {
                continue;
            }

            queue.push([coord[0],coord[1]]);
            console.log("main cell:", currentCoordinate);
            console.log("added to queue:",coord);
        }
    }
    // TODO Find the shortest path
    if (endCell[0] == -1) {
        console.log("end cell [-1,-1]");
        // Did not find the end !!!
        return;
    }
    console.log("end cell != [-1,-1]");
    // FOUND THE END
    // TODO !!!
    let shortestPath : coordinates[] = [];

    shortestPath.push([endCell[0],endCell[1]]);
    console.log('end cell:',endCell);
    console.log('start cell',STATE.getCellArray().getStart());

    while (!isSameCordinate(shortestPath[shortestPath.length-1],STATE.getCellArray().getStart())) {
        let currentCoord = shortestPath[shortestPath.length-1];
        console.log("shortest Path cell:",currentCoord);
        STATE.getCellArray().getCell(currentCoord).getElement().innerHTML = distance.get(currentCoord).toString();
        console.log("distance: ",distance.get(currentCoord).toString());
        shortestPath.push(getNeighbourWithLeastDistance(currentCoord,distance,boardSize));
    }

    STATE.getCellArray().getCell(shortestPath[shortestPath.length-1]).getElement().innerHTML
     = distance.get(shortestPath[shortestPath.length-1]).toString();
}

function isSameCordinate(coord1:coordinates,coord2:coordinates) {
    return (coord1[0]==coord2[0] && coord1[1]==coord2[1]);
}

// Returns true if th coord is contained in arr
function arrayContains(arr: coordinates[], coord: coordinates) : boolean {
    for (let i=0; i<arr.length; i++) {
        if (coord[0]==arr[i][0] && coord[1]==arr[i][1]) return true;
    }
    return false;
}

function getLeastNeighbourDistance(currentCoordinate:coordinates,distance:store2DArrayData<number>,boardSize:number) {
    return distance.get(getNeighbourWithLeastDistance(currentCoordinate,distance,boardSize));
}

function getNeighbourWithLeastDistance(currentCoordinate:coordinates,distance:store2DArrayData<number>,boardSize:number) {
    let neighbours = [[currentCoordinate[0]-1,currentCoordinate[1]],  // West
                      [currentCoordinate[0],currentCoordinate[1]+1],  // North
                      [currentCoordinate[0]+1,currentCoordinate[1]],  // ..
                      [currentCoordinate[0],currentCoordinate[1]-1]];
    let minNeighbour = currentCoordinate;
    for (let i = 0; i < neighbours.length; i++) {
        let coord = neighbours[i];
        if (coord[0]<0 || coord[1]<0 || coord[0]>=boardSize || coord[1]>=boardSize) {
            continue;
        }
        if (distance.get([coord[0],coord[1]]) < distance.get(currentCoordinate)) {
            minNeighbour = coord as coordinates;
        }
    }
    return minNeighbour;
}
