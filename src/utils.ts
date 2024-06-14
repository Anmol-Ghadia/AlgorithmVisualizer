export {
    DataStructure,
    Queue,
    Stack,
    randomRemove,
    randomPushAll,
    generalSearchAlgorithm
}

import {
    StateClass,
    coordinates,
    store2DArrayData
} from './classes.js';

interface DataStructure {
    // Basic
    length:number;
    push(coord:coordinates):void;
    remove():coordinates;
    contains(coord:coordinates):boolean;
    get(index:number):coordinates;

    // Advanced
    pushAll(arr:coordinates[]):void;
    getLength():number;
    removeIndex(index:number):coordinates;
}

// Queue for Coordinates
// First in First out concept
class Queue implements DataStructure{
    protected array: coordinates[];
    length: number;

    constructor() {
        this.array = [];
        this.length = 0;
    }

    push(coord: coordinates) {
        this.array.push(coord);
        this.length = this.array.length;
    }

    // REQUIRES: Queue.length > 0
    remove(): coordinates {
        this.length = this.array.length-1;
        return this.array.splice(0,1)[0];
    }

    contains(coord: coordinates) {
        for (let i=0; i<this.array.length; i++) {
            if (coord[0]==this.array[i][0] && coord[1]==this.array[i][1]) return true;
        }
        return false;
    }

    // Indexed based on FIFO concept
    get(index : number) : coordinates {
        return this.array[index];
    }

    pushAll(arr:coordinates[]) {
        arr.forEach(ele=>{this.push(ele)});
    }

    getLength() {
        return this.length;
    }

    removeIndex(index:number): coordinates {
        this.length = this.array.length-1;
        return this.array.splice(index,1)[0];
    }
}

// Stack data structure
// Last in first out
class Stack implements DataStructure {
    protected array: coordinates[];
    length: number;

    constructor() {
        this.array = [];
        this.length = 0;
    }

    push(coord: coordinates) {
        this.array.push(coord);
        this.length = this.array.length;
    }

    // REQUIRES: Queue.length > 0
    remove(): coordinates {
        this.length = this.array.length-1;
        return this.array.splice(this.length,1)[0];
    }

    contains(coord: coordinates) {
        for (let i=0; i<this.array.length; i++) {
            if (coord[0]==this.array[i][0] && coord[1]==this.array[i][1]) return true;
        }
        return false;
    }

    // Indexed based on LIFO concept
    get(index : number) : coordinates {
        return this.array[this.array.length-index-1];
    }

    pushAll(arr:coordinates[]) {
        arr.forEach(ele=>{this.push(ele)});
    }

    getLength(): number {
        return this.length;
    }

    removeIndex(index: number): coordinates {
        this.length = this.array.length-1;
        return this.array.splice(this.array.length-index-1,1)[0];
    }
}

// Same as Queue data structure but remove()
//    removes a random element
class randomRemove extends Queue {
    remove(): coordinates {
        let size = super.getLength();
        let randomIndex = Math.floor(Math.random()*size);
        return super.removeIndex(randomIndex);
    }
}

// same as Stack but when adding neighbours,
//     they are added in a random order 
class randomPushAll extends Stack {
    pushAll(arr: coordinates[]): void {
    let newArr = shuffleArray(arr);
    newArr.forEach(ele=>{
        super.push(ele);
    })
    }
}


function shuffleArray<T>(array: T[]): T[] {
    // Create a copy of the array to avoid mutating the original array
    const shuffledArray = array.slice();
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    return shuffledArray;
}

// REQUIRES: UnitCell2DArray.isStartEndSet() == true &&
//           StateClass.getMode() == 3
async function generalSearchAlgorithm(STATE: StateClass,toDoDataStructure: DataStructure) {

    // Add colouring for visited nodes
    let boardSize = STATE.getCellArray().getBoardSize();
    let endCell = [-1,-1];

    // Initialization
    let visited= new store2DArrayData(boardSize,false);
    let distance = new store2DArrayData(boardSize,boardSize*boardSize+1);
    
    toDoDataStructure.push(STATE.getCellArray().getStart());
    distance.set(STATE.getCellArray().getStart(),0);

    // console.log("queue:");
    // console.log(toDoDataStructure);

    // Exploration
    while (toDoDataStructure.length != 0) {
        await new Promise(resolve => setTimeout(resolve, STATE.getSpeed()));
        let currentCoordinate = toDoDataStructure.remove();;
        

        if (STATE.getCellArray().isEnd(currentCoordinate)) {
            // Found end
            distance.set(currentCoordinate,getLeastNeighbourDistance(currentCoordinate,distance,boardSize)+1);
            // console.log("found end! at:",currentCoordinate);
            endCell = currentCoordinate;
            break;
        }

        // Check if already visited
        if (visited.get(currentCoordinate)) {
            continue;
        }

        visited.set(currentCoordinate,true);
        let currentDistance = getLeastNeighbourDistance(currentCoordinate,distance,boardSize)+1;
        distance.set(currentCoordinate,currentDistance);
        let color = "hsl(" + ((currentDistance%25)/25)*360 +",100%,50%)";
        STATE.getCellArray().getCell(currentCoordinate).getElement().style.backgroundColor = color;
        STATE.getCellArray().getCell(currentCoordinate).getElement().innerHTML = currentDistance.toString();

        let potentialNeighbours:coordinates[] = [
            [currentCoordinate[0],currentCoordinate[1]-1],  // North
            [currentCoordinate[0]+1,currentCoordinate[1]],  // East
            [currentCoordinate[0],currentCoordinate[1]+1],  // South
            [currentCoordinate[0]-1,currentCoordinate[1]]]  // West
        let neighbours:coordinates []= [];
        for (let i = 0; i < potentialNeighbours.length; i++) {
            let coord = potentialNeighbours[i];
            // Check if the coordinates are outside the board
            if (coord[0]<0 || coord[1]<0 || coord[0]>=boardSize || coord[1]>=boardSize) {
                continue;
            }

            // Check if visited
            if (visited.get(coord)) {
                continue;
            }

            // check if the coordinates containe a wall cell
            if (STATE.getCellArray().isWall(coord) != -1) {
                continue;
            }

            neighbours.push([coord[0],coord[1]]);
            // console.log("main cell:", currentCoordinate);
            // console.log("added to queue:",coord);
        }
        toDoDataStructure.pushAll(neighbours);
    }
    // TODO Find the shortest path
    if (endCell[0] == -1) {
        // console.log("end cell [-1,-1]");
        // Did not find the end !!!
        return;
    }
    // console.log("end cell != [-1,-1]");
    // FOUND THE END
    let shortestPath : coordinates[] = [];

    shortestPath.push([endCell[0],endCell[1]]);
    // console.log('end cell:',endCell);
    // console.log('start cell',STATE.getCellArray().getStart());

    while (!isSameCordinate(shortestPath[shortestPath.length-1],STATE.getCellArray().getStart())) {
        let currentCoord = shortestPath[shortestPath.length-1];
        // console.log("shortest Path cell:",currentCoord);
        STATE.getCellArray().getCell(currentCoord).getElement().innerHTML = distance.get(currentCoord).toString();
        STATE.getCellArray().getCell(currentCoord).getElement().style.backgroundColor = 'orange';
        // console.log("distance: ",distance.get(currentCoord).toString());
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

function getNeighbourWithLeastDistance(parentCoord:coordinates,distance:store2DArrayData<number>,boardSize:number) {
    let neighbours:coordinates[] = [
        [parentCoord[0],parentCoord[1]-1],  // North
        [parentCoord[0]+1,parentCoord[1]],  // East
        [parentCoord[0],parentCoord[1]+1],  // South
        [parentCoord[0]-1,parentCoord[1]]]  // West
    let minNeighbour = parentCoord;
    for (let i = 0; i < neighbours.length; i++) {
        let childCoord = neighbours[i];
        if (childCoord[0]<0 || childCoord[1]<0 || childCoord[0]>=boardSize || childCoord[1]>=boardSize) {
            continue;
        }
        if (distance.get(childCoord) < distance.get(minNeighbour)) {
            minNeighbour = childCoord;
        }
    }
    return minNeighbour;
}
