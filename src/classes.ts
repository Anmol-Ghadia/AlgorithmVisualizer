export {CellContainer,UnitCell,UnitCell2DArray,StateClass};

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

    // removes all references to all cells and resets fields
    clear() {
        for (let i = 0; i < this.array.length; i++) {
            const cell = this.array[i];
            cell.getElement().remove();
        }
        this.array = [];
        this.startCell = [-1,-1];
        this.endCell = [-1,-1];
        this.wallCell = [];
    }

    // Gets a cell at given coordinate
    getCell(xCoord:number,yCoord:number) : UnitCell {
        let xCellsCount = Math.round(Math.pow(this.array.length,1/2));
        return this.array[xCellsCount*yCoord + xCoord];
    }

    // Sets the cell at given coordinates as starting cell
    setStart(xCoord: number, yCoord: number) {
        this.startCell = [xCoord,yCoord];
        this.getCell(xCoord,yCoord).getElement().style.backgroundColor = "green";
        // TODO !!!
    }

    // Sets the cell at given coordinates as ending cell
    setEnd(xCoord : number, yCoord: number) {
        this.endCell = [xCoord,yCoord];
        this.getCell(xCoord,yCoord).getElement().style.backgroundColor = "red";
        // TODO !!!
    }

    // Returns the index if wall is set 
    //    -1 if not found
    isWall(xCoord:number, yCoord:number) : number {
        for (let i = 0; i < this.wallCell.length; i++) {
            const coord = this.wallCell[i];
            if (coord[0] == xCoord && coord[1] == yCoord) return i;
        }
        return -1;
    }

    // Sets the wall at given coordinates as wall cell
    // If the cell is already a wall then it is removed
    setWall(xCoord : number, yCoord: number) {
        let wallIndex = this.isWall(xCoord,yCoord);
        if (wallIndex == -1) {
            // Setwall
            this.wallCell.push([xCoord,yCoord]);
            this.getCell(xCoord,yCoord).getElement().style.backgroundColor = "black"; // TODO !!!
            console.log("Wall Array Size Increased:",this.wallCell.length);   
        } else {
            // remove from wall list
            this.wallCell.splice(wallIndex,1);
            this.getCell(xCoord,yCoord).getElement().style.backgroundColor = "white"; // TODO !!!
            console.log("Wall Array Size Decreased:",this.wallCell.length);
        }
        console.log(this.wallCell);
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
type ModeType = 0 | 1 | 2;

// Represents the current state of program
class StateClass {

    protected mode: ModeType;       // mode defines what the user is currently doing
    protected cellArray: UnitCell2DArray;
    protected cellContainer: CellContainer;
    
    constructor(cellArray: UnitCell2DArray,cellContainer:CellContainer) {
        this.mode = 0
        this.cellArray = cellArray;
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
        console.log(deltaX,":",deltaY)

        let unit_width = this.cellArray.getCell(0,0).getElement().getBoundingClientRect().width;
        let xCoord = Math.floor(deltaX / unit_width);
        let yCoord = Math.floor(deltaY / unit_width);

        switch (this.mode) {
            case 0:
                console.log("Start set at:",xCoord,yCoord); // TODO !!! add logging
                this.cellArray.setStart(xCoord,yCoord);
                this.updateMode(1);    
                break;
            case 1:
                console.log("End set at:",xCoord,yCoord); // TODO !!! add logging
                this.cellArray.setEnd(xCoord,yCoord);
                this.updateMode(2);
                break;
            default:
                console.log("Wall toggled at:", xCoord,yCoord); // TODO !!! add logging
                this.cellArray.setWall(xCoord,yCoord);
                break;
        }
    }

    // Updates the state to give number
    updateMode(num: ModeType) {
        this.mode = num;
    }
}
