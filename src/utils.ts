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
    getType():string;
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
    getType() {
        return 'Queue';
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
    getType() {
        return 'Stack';
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
    getType() {
        return 'randomRemove';
    }
}

class randomPushAll implements DataStructure {
    // Basic
    protected arr: coordinates[];
    protected tandemArr: number[];
    public length:number;
    protected start:coordinates;
    protected end:coordinates;
    protected distance: store2DArrayData<number>;
    
    
    constructor(start:coordinates,end:coordinates) {
        this.length = 0;
        this.arr = [];
        this.tandemArr = [];
        this.start = start;
        this.end = end;
        this.distance = new store2DArrayData(0,0);
    }

    push(coord:coordinates) {

        this.tandemArr.push(this.computeDistanceValue(coord));
        this.arr.push(coord);
        this.length++;

    };

    remove():coordinates {
        let mostAppealIndex = 0;
        for (let index = 1; index < this.tandemArr.length; index++) {
            const currentAppeal = this.tandemArr[index];
            if (this.tandemArr[mostAppealIndex] >= currentAppeal) {
                mostAppealIndex = index;
            }
        }
        let coord = this.arr[mostAppealIndex];
        this.arr.splice(mostAppealIndex,1);
        this.tandemArr.splice(mostAppealIndex,1);
        
        this.length = this.arr.length
        return coord;
    }

    contains(coord:coordinates):boolean {
        for (let index = 0; index < this.arr.length; index++) {
            if (isSameCordinate(coord,this.arr[index])) return true;
        }
        return false;
    }


    get(index:number):coordinates {
        // Currently Not implemented
        return [-1,-1];
    }

    // Advanced
    pushAll(arr:coordinates[]):void {
        arr.forEach(ele => {
            this.push(ele);
        })
    }

    getLength():number {
        return this.arr.length;
    }

    removeIndex(index:number):coordinates {
        // Not implemented
        this.length = this.arr.length-1
        return [-1,-1];
    }

    // Returns the coordinates appeal
    private computeDistanceValue(coord:coordinates) {
        
        let g = this.distance.get(coord);
        let h = Math.pow(Math.abs(this.end[0]-coord[0]),2)
              + Math.pow(Math.abs(this.end[1]-coord[1]),2);

        // TODO !!! G needs to passsed here and h should be computed
        return g+Math.pow(h,1/2);
    }

    getType() {
        return 'randomPushAll';
    }

    setDistance(dist: store2DArrayData<number>) {
        this.distance = dist;
    }
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
                break;
            
        }
    }

    // Initializes by adding the starting cell
    // Returns true if successfull
    private initialize() {
        if (this.state.getCellArray().isStartEndSet()) {
            console.log("type:",this.toDoDataStructure.getType())
            if (this.toDoDataStructure.getType()=="randomPushAll") {
                let randomPushAll = this.toDoDataStructure as randomPushAll;
                randomPushAll.setDistance(this.distance);
                console.log("distance matrix set");
            }
            this.toDoDataStructure.push(this.state.getCellArray().getStart());
            this.distance.set(this.state.getCellArray().getStart(),0);
            this.mode = 1;
            this.state.updateMode(3);
        } else {
            this.mode = 0;
        }
    }

    // REQUIRES mode==1
    private exploreOnce() {
        if (this.toDoDataStructure.length == 0 ) {
            this.setEndStyle();
            this.mode = 3;
            return;
        }
        let currentCoord = this.toDoDataStructure.remove();;
        

        if (this.state.getCellArray().isEnd(currentCoord)) {
            // Found end
            let currentDistance = this.computeCurrentDistance(currentCoord);
            this.distance.set(currentCoord,currentDistance);
            this.setCellStyling(currentCoord);
            notify('found end at: ['+currentCoord[0].toString()+','+currentCoord[1].toString()+']');
            this.endCell = currentCoord;
            this.mode = 2
            return;
        }

        // Check if already visited
        if (this.visited.get(currentCoord)) {
            this.computeOnce();
            return;
        }

        this.visited.set(currentCoord,true);
        let currentDistance = this.computeCurrentDistance(currentCoord);
        this.distance.set(currentCoord,currentDistance);
        this.setCellStyling(currentCoord);

        if (this.neighborsNeedingUpdate(currentCoord).length != 0) {
            this.updateVisitedDistances(currentCoord);
        }

        let neighbours:coordinates []= [];
        this.getValidNeighbors(currentCoord).forEach(coord=>{
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
            this.shortestPath.push(this.leastDistanceNeighbor(currentCoord));
        }
        let start = this.shortestPath[this.shortestPath.length-1];
        this.setPathStyling(start);
        this.mode = 3;
        setTimeout(() => {
            this.setEndStyle();
        }, 1000);

        this.state.getCellArray().getCell(start).getElement().innerHTML = this.distance.get(start).toString();
    }

    private setEndStyle() {
        this.state.getCellArray().applyEndStyle()
    }

    // Returns the distance of current cell as computed by
    //   min(neighbour distances) + 1
    private computeCurrentDistance(currentCoordinate:coordinates) {
        let leastDistanceNeigbor = this.leastDistanceNeighbor(currentCoordinate);
        return this.distance.get(leastDistanceNeigbor)+1;
    }
    
    // Retuns the neighbor whose distance value is least
    private leastDistanceNeighbor(parentCoord:coordinates) {
        
        let minNeighbour = parentCoord;

        this.getValidNeighbors(parentCoord).forEach( childCoord => {
            if (this.distance.get(childCoord) < this.distance.get(minNeighbour)) {
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
            
            let currentDistance = this.computeCurrentDistance(currentCoordinate);
            this.distance.set(currentCoordinate,currentDistance);
            this.setCellStyling(currentCoordinate);
            
            todo.pushAll(this.neighborsNeedingUpdate(currentCoordinate));
            
        }
    }

    // Returns the neighbors whose distances need to be updated as they are more than
    //   plus one of current distance
    private neighborsNeedingUpdate(parentCoord :coordinates) {
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
        element.classList.add('unit_cell_path');
        element.style.backgroundColor = 'rgba(255,255,0,0.4)';
        
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

        // let color = "hsla(" + ((currentDistance%25)/25)*360 +",100%,50%,50%)";
        let color = "rgba(255,255,255,0.4)";
        element.classList.add('unit_cell_explored');
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
