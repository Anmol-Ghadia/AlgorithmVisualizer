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

// Contains reference to all cells
// NOTE: Assumes that it is a square
class UnitCell2DArray {
    
    private array: UnitCell[];    // Array of cells
    private startCell: number[];  // Coordinates of start cell
    private endCell: number[];    // Coorrdinates of end cell

    constructor() {
        this.array = [];
        this.startCell = [];
        this.endCell = [];
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
        this.startCell = [];
        this.endCell = [];
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
// 3 is waiting for user to break walls
type ModeType = 0 | 1 | 2 | 3;

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
    handleMouseDown(e: Event) {
        if (this.mode != 0 && this.mode != 1) {
            // TODO !!!
            return;
        }

        let event = e as MouseEvent;
        
        let deltaX = event.clientX - this.cellContainer.getX();
        let deltaY = event.clientY - this.cellContainer.getY();
        console.log(deltaX,":",deltaY)

        let unit_width = this.cellArray.getCell(0,0).getElement().getBoundingClientRect().width;
        let xCoord = Math.floor(deltaX / unit_width);
        let yCoord = Math.floor(deltaY / unit_width);

        if (this.mode == 0) {
            console.log("Start set at:",xCoord,yCoord);
            this.cellArray.setStart(xCoord,yCoord);
            this.updateMode(1);
        } else {
            console.log("End set at:",xCoord,yCoord);
            this.cellArray.setEnd(xCoord,yCoord);
            this.updateMode(2);
        }
    }

    // Updates the state to give number
    updateMode(num: ModeType) {
        this.mode = num;
    }
}
