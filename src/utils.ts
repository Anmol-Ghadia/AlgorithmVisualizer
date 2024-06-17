export {
    DataStructure,
    Queue,
    Stack,
    randomRemove,
    randomPushAll,
    isSameCordinate,
    generalSearchClass
}

import { notify } from './logging.js';

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

// 0 means nothing set
// 1 means can explore
// 2 can find least path
// 3 means search over
type explorationMode = 0 | 1 | 2 | 3;

// REQUIRES: UnitCell2DArray.isStartEndSet() == true &&
//           StateClass.getMode() == 3
class generalSearchClass {
    // Required
    protected state : StateClass;
    protected mode: explorationMode=0;
    protected isSimulating: boolean = false;
    
    // Supplied by user
    protected toDoDataStructure: DataStructure;
    

    // Extras    
    private endCell: coordinates = [-1,-1];
    private visited: store2DArrayData<boolean>;
    private distance: store2DArrayData<number>;
    private boardSize: number;
    private shortestPath: coordinates[]=[];

    constructor(state:StateClass,type:DataStructure) {
        this.boardSize = state.getCellArray().getBoardSize();

        this.visited= new store2DArrayData(this.boardSize,false);
        this.distance = new store2DArrayData(
            this.boardSize,
            this.boardSize*this.boardSize+1);

        this.state = state;
        this.toDoDataStructure = type;
    }

    async computeAllwithDelay() {
        this.isSimulating = true;
        while (this.mode!=3 && this.isSimulating) {
            if (this.state.getSpeed()!=0) {
                await new Promise(resolve => setTimeout(resolve, this.state.getSpeed()));
            }
            this.computeOnce();
        }
    }

    isPlaying():boolean {
        return this.isSimulating;
    }

    toggle():boolean {
        if (this.isPlaying()){
            this.pause();
            return true;
        } else {
            this.play();
            return false;
        }
    }

    play() {
        this.computeAllwithDelay();
    }

    pause() {
        this.isSimulating = false;
    }
    

    computeOnce() {
        switch (this.mode) {
            case 0:
                this.initialize();
                break;
            case 1:
                this.exploreOnce();
                break;
            case 2:
                this.findLeastPathOnce();
                break;
            case 3:
                // OVER
                // !!! maybe notify user
                break;
            
        }
    }

    // Initializes by adding the starting cell
    // Returns true if successfull
    private initialize() {
        if (this.state.getCellArray().isStartEndSet()) {
            this.toDoDataStructure.push(this.state.getCellArray().getStart());
            this.distance.set(this.state.getCellArray().getStart(),0);
            this.mode = 1;
        } else {
            this.mode = 0;
        }
    }

    // REQUIRES mode==1
    private exploreOnce() {
        if (this.toDoDataStructure.length == 0 ) {
            this.mode = 3;
            return;
        }
        let currentCoordinate = this.toDoDataStructure.remove();;
        

        if (this.state.getCellArray().isEnd(currentCoordinate)) {
            // Found end
            let currentDistance = this.getLeastNeighbourDistance(currentCoordinate,this.distance,this.boardSize)+1;
            this.distance.set(currentCoordinate,currentDistance);
            this.setCellStyling(currentCoordinate);
            notify('found end at: ['+currentCoordinate[0].toString()+','+currentCoordinate[1].toString()+']');
            this.endCell = currentCoordinate;
            this.mode = 2
            return;
        }

        // Check if already visited
        if (this.visited.get(currentCoordinate)) {
            this.computeOnce();
            return;
        }

        this.visited.set(currentCoordinate,true);
        let currentDistance = this.getLeastNeighbourDistance(currentCoordinate,this.distance,this.boardSize)+1;
        this.distance.set(currentCoordinate,currentDistance);
        this.setCellStyling(currentCoordinate);

        if (this.getNeighboursWithMoreThanOnePlusDistance(currentCoordinate).length != 0) {
            this.updateVisitedDistances(currentCoordinate);
        }

        let neighbours:coordinates []= [];
        this.getValidNeighbors(currentCoordinate).forEach(coord=>{
            // Check if visited
            if (this.visited.get(coord)) {
                return;
            }

            // check if the coordinates containe a wall cell
            if (this.state.getCellArray().isWall(coord) != -1) {
                return;
            }

            neighbours.push([coord[0],coord[1]]);
        });
        this.toDoDataStructure.pushAll(neighbours);
    }

    // REQUIRES mode==2
    private findLeastPathOnce() {

        this.shortestPath.push([this.endCell[0],this.endCell[1]]);

        while (!isSameCordinate(this.shortestPath[this.shortestPath.length-1],this.state.getCellArray().getStart())) {
            let currentCoord = this.shortestPath[this.shortestPath.length-1];
            this.setPathStyling(currentCoord);
            this.shortestPath.push(this.getNeighbourWithLeastDistance(currentCoord,this.distance));
        }
        this.mode = 3;

        this.state.getCellArray().getCell(this.shortestPath[this.shortestPath.length-1]).getElement().innerHTML
        = this.distance.get(this.shortestPath[this.shortestPath.length-1]).toString();
    }

    private getLeastNeighbourDistance(currentCoordinate:coordinates,distance:store2DArrayData<number>,boardSize:number) {
        return distance.get(this.getNeighbourWithLeastDistance(currentCoordinate,distance));
    }
    
    private getNeighbourWithLeastDistance(parentCoord:coordinates,distance:store2DArrayData<number>) {
        
        let minNeighbour = parentCoord;

        this.getValidNeighbors(parentCoord).forEach( childCoord => {
            if (distance.get(childCoord) < distance.get(minNeighbour)) {
                minNeighbour = childCoord;
            }
        });

        return minNeighbour;
    }

    // Recursively search around the given coord to see if all the distances are correct
    private updateVisitedDistances(coord: coordinates) {
        console.log("update distances called");
        let todo = new Queue();
        todo.push(coord);
        while (todo.length != 0) {
            let currentCoordinate = todo.remove();
            
            let currentDistance = this.getLeastNeighbourDistance(currentCoordinate,this.distance,this.boardSize)+1;
            this.distance.set(currentCoordinate,currentDistance);
            this.setCellStyling(currentCoordinate);
            
            todo.pushAll(this.getNeighboursWithMoreThanOnePlusDistance(currentCoordinate));
            
        }
    }

    private getNeighboursWithMoreThanOnePlusDistance(parentCoord :coordinates) {
        let outNeighbours:coordinates[] = [];
        this.getValidNeighbors(parentCoord).forEach(neighbour => {
            if (!this.visited.get(neighbour)) {
                return;
            }
            if (this.distance.get(neighbour) > (1 + this.distance.get(parentCoord))) {
                outNeighbours.push(neighbour);
            }
        });
        return outNeighbours;
    }


    // Sets the cell's styling as a path cell 
    //  Ignores, start and end cells
    private setPathStyling(coord:coordinates) {
        // Skip if start cell
        if (isSameCordinate(this.state.getCellArray().getStart(),coord)) {
            return;
        }
        //Skip if end cell
        if (isSameCordinate(this.state.getCellArray().getEnd(),coord)) {
            return;
        }
        
        let element = this.state.getCellArray().getCell(coord).getElement();
        element.style.backgroundColor = 'orange';
        
    }

    // Sets the cell's styling as a explored cell
    //  Ignores, start and end cells
    private setCellStyling(coord:coordinates) {
        let element = this.state.getCellArray().getCell(coord).getElement();
        let currentDistance = this.distance.get(coord); 
        // Skip if start cell
        if (isSameCordinate(this.state.getCellArray().getStart(),coord)) {
            element.innerHTML = currentDistance.toString();
            return;
        }
        //Skip if end cell
        if (isSameCordinate(this.state.getCellArray().getEnd(),coord)) {
            element.innerHTML = currentDistance.toString();
            return;
        }

        let color = "hsl(" + ((currentDistance%25)/25)*360 +",75%,65%)";
        element.style.backgroundColor = color;
        element.innerHTML = currentDistance.toString();
        element.title += '\nDistance: ' + currentDistance.toString();

    }

    // Returns a list of valid neigbor coordinates
    private getValidNeighbors(parentCoord:coordinates) {
        let neighbours:coordinates[] = [
            [parentCoord[0],parentCoord[1]-1],  // North
            [parentCoord[0]+1,parentCoord[1]],  // East
            [parentCoord[0],parentCoord[1]+1],  // South
            [parentCoord[0]-1,parentCoord[1]]   // West
        ]
        let outNeighbours:coordinates[] = [];
        neighbours.forEach(neighbour => {
            if (neighbour[0]<0 || neighbour[1]<0 ||
                neighbour[0]>=this.boardSize || neighbour[1]>=this.boardSize) {
                return;
            }
            outNeighbours.push(neighbour);
        });
        return outNeighbours;
    }
}

// Returns true if both coordinates are the same
function isSameCordinate(coord1:coordinates,coord2:coordinates) {
    return (coord1[0]==coord2[0] && coord1[1]==coord2[1]);
}
