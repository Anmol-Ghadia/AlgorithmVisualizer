import { UnitCell,
    UnitCell2DArray,
    CellContainer,
    StateClass,
    coordinates,
    store2DArrayData } from './classes.js';
import {
    breadthFirstSearch,
    depthFirstSearch,
    randomCellSearch,
    randomDirectionSearch
} from './searchAlgorithms.js'

let STATE: StateClass;
let CELL_ARRAY : UnitCell2DArray;
let CELL_CONTAINER: CellContainer;
let SLIDER: HTMLInputElement;

addEventListener('DOMContentLoaded',init);

// initilization routine
function init() {
    
    if (!setCellContinerGlobals()) return;
    if (!setCellCountSlider()) return;
    if (!clearBoardInit()) return;
    if (!BFSInit()) return;
    if (!DFSInit()) return;
    if (!randomCellSearchInit()) return;
    if (!randomDirectionSearchInit()) return;
    if (!randomMazeInit()) return;
    if (!setSpeedSlider()) return;

    STATE = new StateClass(CELL_ARRAY,CELL_CONTAINER);
    
    if (!makeAndPopulateCells(parseInt(SLIDER.value))) return;
}

// Returns true if BFS button can be properly set
function BFSInit() {
    let button = document.getElementById('BFS_button');
    if (button == null) {
        console.log('ERROR: 103');
        return false;
    }
    button.addEventListener('click', () => {
        STATE.updateMode(3);
        breadthFirstSearch(STATE);
    })
    return true;
}

// Returns true if DFS button can be properly set
function DFSInit() {
    let button = document.getElementById('DFS_button');
    if (button == null) {
        console.log('ERROR: 105');
        return false;
    }
    button.addEventListener('click', () => {
        STATE.updateMode(3);
        depthFirstSearch(STATE);
    })
    return true;
}

// Returns true if Random Cell Search button can be properly set
function randomCellSearchInit() {
    let button = document.getElementById('Random_cell_button');
    if (button == null) {
        console.log('ERROR: 106');
        return false;
    }
    button.addEventListener('click', () => {
        STATE.updateMode(3);
        randomCellSearch(STATE);
    })
    return true;
}

// Returns true if Random Cell Search button can be properly set
function randomDirectionSearchInit() {
    let button = document.getElementById('Random_direction_button');
    if (button == null) {
        console.log('ERROR: 107');
        return false;
    }
    button.addEventListener('click', () => {
        STATE.updateMode(3);
        randomDirectionSearch(STATE);
    })
    return true;
}

// Returns true if Generate Random maze button can be properly set
function randomMazeInit() {
    let button = document.getElementById('random_maze_button');
    if (button == null) {
        console.log('ERROR: 104');
        return false;
    }
    button.addEventListener('click', () => {
        generateRandomMaze();
    })
    return true;
}

// Returns true if clear button can be properly set
function clearBoardInit() {
    let button = document.getElementById('clear_board_button');
    if (button == null) {
        console.log('ERROR: 102');
        return false;
    }
    button.addEventListener('click', () => {
        STATE.clearBoard();
    })
    return true;
}

// Returns false if failed, otherwise sets global(s) for container
function setCellContinerGlobals() : boolean {
    let temp_element = document.getElementById('cell_container')!;
    if (temp_element == null) {
        console.log('ERROR: 100');
        return false;
    }

    CELL_CONTAINER = new CellContainer(temp_element);
    CELL_ARRAY = new UnitCell2DArray();

    CELL_CONTAINER.getElement().addEventListener("mousedown",(event)=>{STATE.handleMouseDown(event)});

    return true;
}

// Returns false if failed, otherwise sets global(s) for slider
function setCellCountSlider() {
    SLIDER = document.getElementById('cell_count_slider')! as HTMLInputElement;
    if (SLIDER == null) {
        console.log('ERROR: 101');
        return false
    }
    SLIDER.addEventListener('input',()=>{
        STATE.reset();
        makeAndPopulateCells(parseInt(SLIDER.value));
    });
    return true;
}

// Returns false if failed, otherwise initializes global(s) for slider
function setSpeedSlider() {
    let slider = document.getElementById('simulation_speed_slider')! as HTMLInputElement;
    if (slider == null) {
        console.log('ERROR: 104');
        return false
    }
    slider.addEventListener('input',()=>{
        STATE.setSpeed(parseInt(slider.value)*100);
    });
    return true;
}

// Populates the cells according to the number of cells in one direction
function makeAndPopulateCells(numberOfCells:number) : boolean {

    for (let y = 0; y < numberOfCells; y++) {
        for (let x = 0; x < numberOfCells; x++) {

            let element = document.createElement('div');
            element.style.width = (100 / numberOfCells) + '%';
            element.style.height = (100 / numberOfCells) + '%';
            element.classList.add('unit_cell');

            CELL_CONTAINER.getElement().appendChild(element);

            let cell = new UnitCell(x,y,element);
            CELL_ARRAY.push(cell);

        }
    }

    return true;
}

function generateRandomMaze() {
    let start = STATE.getCellArray().getStart();
    let end = STATE.getCellArray().getEnd();
    for (let x = 0; x < STATE.getCellArray().getBoardSize(); x++) {
        for (let y=0; y < STATE.getCellArray().getBoardSize();y++) {
            if (isSameCordinate(start,[x,y]) || isSameCordinate(end,[x,y])) {
                continue;
            }
            let rand = Math.random();
            if (rand > 0.7) {
                STATE.getCellArray().setWall([x,y]);
            } 
        }
    }
}

function isSameCordinate(coord1:coordinates,coord2:coordinates) {
    return (coord1[0]==coord2[0] && coord1[1]==coord2[1]);
}
