import { UnitCell,
    UnitCell2DArray,
    CellContainer,
    StateClass,
    coordinates,
    store2DArrayData } from './classes.js';

import {
    Queue,
    Stack,
    randomRemove,
    randomPushAll,
    generalSearchClass
} from './utils.js';

let STATE: StateClass;
let CELL_ARRAY : UnitCell2DArray;
let CELL_CONTAINER: CellContainer;
let SLIDER: HTMLInputElement;
let SEARCH: generalSearchClass;

addEventListener('DOMContentLoaded',init);

// initilization routine
function init() {
    
    if (!setCellContinerGlobals()) return;
    if (!setCellCountSlider()) return;
    // if (!clearBoardInit()) return;
    // if (!BFSInit()) return;
    // if (!DFSInit()) return;
    // if (!randomCellSearchInit()) return;
    // if (!randomDirectionSearchInit()) return;
    // if (!randomMazeInit()) return;
    if (!setSpeedSlider()) return;

    STATE = new StateClass(CELL_ARRAY,CELL_CONTAINER);
    
    if (!makeAndPopulateCells(parseInt(SLIDER.value))) return;
    

    // TEMP !!!
    if (!initButtons()) return;
}

function initButtons() {
    let pauseButton = document.getElementById('pause_button') as HTMLButtonElement;
    const startButton = document.getElementById('start_button') as HTMLButtonElement;
    const stepButton = document.getElementById('step_button') as HTMLButtonElement;
    const radios = document.getElementsByName("algorithm_radio") as NodeListOf<HTMLInputElement>;
    
    // Decide Algorithm
    let algorithm:String;
    for (const radio of radios) {
        if (radio.checked) {
            algorithm = radio.value;
            break;
        }
    }

    // Set Step Button
    if (stepButton == null) {
        console.log('ERROR: 112');
        return false;
    }
    stepButton.addEventListener('click', () => {
        SEARCH.computeOnce();
    })

    // Set Pause Button
    if (pauseButton == null) {
        console.log('ERROR: 111');
        return false;
    }
    pauseButton.addEventListener('click', () => {
        SEARCH.pause();
        startButton.disabled = false;
        stepButton.disabled = false;
        pauseButton.disabled = true;
    })


    // Set Start Button
    if (startButton == null) {
        console.log('ERROR: 110');
        return false;
    }
    startButton.addEventListener('click', () => {
        if (STATE.getCellArray().isStartEndSet()){
            // Ready
            switch (algorithm) {
                case 'BFS':
                    SEARCH = new generalSearchClass(STATE,new Queue());
                    break;
                case 'DFS':
                    SEARCH = new generalSearchClass(STATE,new Stack());
                    break;
                case 'randCell':
                    SEARCH = new generalSearchClass(STATE,new randomRemove());
                    break;
                case 'randPath':
                    SEARCH = new generalSearchClass(STATE,new randomPushAll());
                    break;
            }
            SEARCH.computeAllwithDelay();
            startButton.disabled = true
            stepButton.disabled = true;
            pauseButton.disabled = false;
        } else {
            // Not Ready
            console.log('Select start and end points');
        }
    })

    let clearButton = document.getElementById('clear_board_button');
    if (clearButton == null) {
        console.log('ERROR: 102');
        return false;
    }
    clearButton.addEventListener('click', () => {
        SEARCH.pause();
        SEARCH = new generalSearchClass(STATE,new Queue());
        startButton.disabled = false;
        stepButton.disabled = false;
        pauseButton.disabled = true;
        setTimeout(() => {
            STATE.clearBoard();
        }, STATE.getSpeed());
    })
    return true;
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


function breadthFirstSearch(STATE:StateClass) {
    let search = new generalSearchClass(STATE,new Queue());
    search.computeAllwithDelay();
}

function depthFirstSearch(STATE:StateClass) {
    let search = new generalSearchClass(STATE,new Stack());
    search.computeAllwithDelay();
}

function randomCellSearch(STATE:StateClass) {
    let search = new generalSearchClass(STATE,new randomRemove());
    search.computeAllwithDelay();
}

function randomDirectionSearch(STATE:StateClass) {
    let search = new generalSearchClass(STATE,new randomPushAll());
    search.computeAllwithDelay();
}
