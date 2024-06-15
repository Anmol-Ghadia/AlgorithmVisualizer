export {CellContainer,UnitCell,UnitCell2DArray,StateClass,coordinates, store2DArrayData};
import { notify } from "./logging.js";
// Contains latest information regarding container of all cells 
class CellContainer {
    
    protected element: HTMLElement;

    constructor(ele: HTMLElement) {
        this.element = ele;
    }

    // Returns DOM element
    getElement() : HTMLElement {
        return this.element;
    }

    // Returns the top left corner's x Coordinate
    getX() : number {
        return this.element.getBoundingClientRect().x;
    }

    // Returns the top left corner's y Coordinate
    getY() : number {
        return this.element.getBoundingClientRect().y;
    }

    // Returns the width of container in pixels
    getWidth(): number {
        return this.element.getBoundingClientRect().width;
    }

    // Returns the height of container in pixels
    getHeight(): number {
        return this.element.getBoundingClientRect().height;
    }
}

type coordinates = [number,number];

// Contains reference to all cells
// NOTE: Assumes that it is a square
class UnitCell2DArray {
    
    private array: UnitCell[];       // Array of cells
    private startCell: coordinates;     // Coordinates of start cell
    private endCell: coordinates;       // Coordinates of end cell
    private wallCell: coordinates[];    // Coordinates of wall cells

    constructor() {
        this.array = [];
        this.startCell = [-1,-1];
        this.endCell = [-1,-1];
        this.wallCell = [];
    }

    // Adds Cell to the array
    push(cell: UnitCell) {
        this.array.push(cell);
    }

    // returns the number of cells in each direction
    getBoardSize() : number {
        return Math.floor(Math.pow(this.array.length,1/2));
    }

    // removes all references to all cells and resets fields
    clearAll() {
        for (let i = 0; i < this.array.length; i++) {
            const cell = this.array[i];
            cell.getElement().remove();
        }
        this.array = [];
        this.startCell = [-1,-1];
        this.endCell = [-1,-1];
        this.wallCell = [];
    }

    // Resets the current board and preserves the cells
    // Resets backgroundColor of every cell
    clearStartEndWall() {
        this.getCell(this.startCell).getElement().classList.remove('unit_cell_start');
        this.getCell(this.endCell).getElement().classList.remove('unit_cell_end');
        this.wallCell.forEach(coord => {
            this.getCell(coord).getElement().classList.remove('unit_cell_wall');
        })
        this.array.forEach(cell => {
            cell.getElement().style.backgroundColor = '';
            cell.getElement().innerHTML = '';
        })
        this.startCell = [-1,-1];
        this.endCell = [-1,-1];
        this.wallCell = [];
        notify('cleared board');
    }

    // Gets a cell at given coordinate
    getCell(coord: coordinates) : UnitCell {
        return this.array[this.getBoardSize()*coord[1] + coord[0]];
    }

    isStartEndSet() : boolean {
        return this.startCell[0] != -1 && this.startCell[1] != -1 &&
        this.endCell[0] != -1 && this.startCell[1] != -1;
    }

    // Sets the cell at given coordinates as starting cell
    setStart(coord: coordinates) {
        this.startCell = coord;
        this.getCell(coord).getElement().classList.add("unit_cell_start");
    }

    // returns the coordinates of starting cell
    //   [-1,-1] reutrned if not set
    getStart() {
        return this.startCell;
    }

    // Sets the cell at given coordinates as ending cell
    setEnd(coord: coordinates) {
        this.endCell = coord;
        this.getCell(coord).getElement().classList.add("unit_cell_end");
        // TODO !!!
    }

    getEnd() {
        return this.endCell;
    }

    // Returns true if the given coordinates are end cell
    isEnd(coord: coordinates) {
        if (this.endCell[0] == coord[0] && this.endCell[1] == coord[1]) return true;
        return false
    }

    // Returns the index if wall is set 
    //    -1 if not found
    isWall(coord: coordinates) : number {
        for (let i = 0; i < this.wallCell.length; i++) {
            const currentCoord = this.wallCell[i];
            if (currentCoord[0] == coord[0] && currentCoord[1] == coord[1]) return i;
        }
        return -1;
    }

    // Sets the wall at given coordinates as wall cell
    // If the cell is already a wall then it is removed
    setWall(coord: coordinates) {
        let wallIndex = this.isWall(coord);
        if (wallIndex == -1) {
            // Setwall
            this.wallCell.push(coord);
            this.getCell(coord).getElement().classList.add('unit_cell_wall');
        } else {
            // remove from wall list
            this.wallCell.splice(wallIndex,1);
            this.getCell(coord).getElement().classList.remove('unit_cell_wall');
        }
    }
}

// Represents a single cell
class UnitCell {

    // Position of this on grid
    protected posX: number;
    protected posY: number;
    protected element: HTMLDivElement; // DOM element
    
    constructor(positionX:number, positionY:number,element:HTMLDivElement) {
        this.posX = positionX;
        this.posY = positionY;
        this.element = element;
    }

    // Returns the DOM element
    getElement() : HTMLElement {
        return this.element;
    }
}

// 0 is waiting for user to select starting point
// 1 is waiting for user to select ending point
// 2 is waiting for user to select walls
// 3 is when no changes can be made to the state
type ModeType = 0 | 1 | 2 | 3;

// Represents the current state of program
class StateClass {

    protected mode: ModeType;       // mode defines what the user is currently doing
    protected cellArray: UnitCell2DArray;
    protected cellContainer: CellContainer;
    protected speed = 0;
    
    constructor(cellContainer:CellContainer) {
        this.mode = 0
        this.cellArray = new UnitCell2DArray();
        this.cellContainer = cellContainer;
    }

    // Returns the mode value
    getStateValue() {
        return this.mode as number;
    }

    // handles mousedown events based on current mode
    handleMouseDown(eve: Event) {

        let event = eve as MouseEvent;
        
        let deltaX = event.clientX - this.cellContainer.getX();
        let deltaY = event.clientY - this.cellContainer.getY();

        let unit_width = this.cellArray.getCell([0,0]).getElement().getBoundingClientRect().width;
        let xCoord = Math.floor(deltaX / unit_width);
        let yCoord = Math.floor(deltaY / unit_width);

        switch (this.mode) {
            case 0:
                notify("Start set");
                this.cellArray.setStart([xCoord,yCoord]);
                this.updateMode(1);    
                break;
            case 1:
                notify("End set");
                this.cellArray.setEnd([xCoord,yCoord]);
                this.updateMode(2);
                break;
            case 2:
                this.cellArray.setWall([xCoord,yCoord]);
                break;
            case 3:
                // Ignored click
                break;
        }
    }

    // Removes all cells from the board
    reset() {
        this.mode = 0;
        this.cellArray.clearAll();
    }

    // Clears the start, end and walls
    clearBoard() {
        this.mode = 0;
        this.cellArray.clearStartEndWall();
    }

    // Updates the state to give number
    updateMode(num: ModeType) {
        this.mode = num;
    }

    getCellArray() {
        return this.cellArray;
    }

    setSpeed(speed : number) {
        this.speed = speed;
    }

    getSpeed() {
        return this.speed;
    }
}

// Represents a 2d square array with faster acces times
// can be accessed with two dimensions
// generally used to store distance or visited value for a coordinate
class store2DArrayData<T> {
    
    protected arr: T[][];

    constructor (size : number, element : T) {
        let outArr = [];
        for (let i = 0; i < size; i++) {
            let temp = [];
            for (let j = 0; j < size; j++) {
                temp.push(element);
            }
            outArr.push(temp);
        }
        this.arr = outArr;
    }

    get(coord: coordinates) : T {
        return this.arr[coord[0]][coord[1]];
    }

    set(coord: coordinates, value: T) {
        this.arr[coord[0]][coord[1]] = value;
    }
}
