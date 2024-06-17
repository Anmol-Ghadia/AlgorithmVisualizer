import {
    fatalError,
    notify
} from './logging.js';

import { UnitCell,
    UnitCell2DArray,
    CellContainer,
    StateClass,
} from './classes.js';



import {
    Queue,
    Stack,
    randomRemove,
    randomPushAll,
    generalSearchClass,
    isSameCordinate
} from './utils.js';

let STATE: StateClass;
let CELL_CONTAINER: CellContainer;
let SLIDER: HTMLInputElement;
let SEARCH: generalSearchClass;
let ALGORITHMRADIOS: HTMLDivElement[];
let PAUSEBUTTON:HTMLButtonElement;
let STARTBUTTON:HTMLButtonElement;
let STEPBUTTON:HTMLButtonElement;
let CLEARBUTTON:HTMLButtonElement;
let CURRENTRADIO: 0 | 1 | 2 | 3;

addEventListener('DOMContentLoaded',init);
addEventListener('click',()=>{console.log("click!")});

// initilization routine
function init() {
    
    if (!setCellContinerGlobals()) return;
    if (!setCellCountSlider()) return;
    if (!initSimulationButtons()) return;

    STATE = new StateClass(CELL_CONTAINER);
    makeAndPopulateCells(parseInt(SLIDER.value));

    if (!randomMazeInit()) return;
    if (!setSpeedSlider()) return;

    addEventListenersOnSimulationButtons();
    addEventListenersOnRadioButtons();
}

// Returns false if failed, otherwise sets global(s) for container
function setCellContinerGlobals() : boolean {
    let temp_element = document.getElementById('cell_container')!;
    if (temp_element == null) {
        fatalError('ERROR: 100');
        return false;
    }

    CELL_CONTAINER = new CellContainer(temp_element);
    CELL_CONTAINER.getElement().addEventListener("mousedown",(event)=>{STATE.handleMouseDown(event)});

    return true;
}

// Returns false if failed, otherwise sets global(s) for slider
function setCellCountSlider() {
    SLIDER = document.getElementById('cell_count_slider')! as HTMLInputElement;
    if (SLIDER == null) {
        fatalError('ERROR: 101');
        return false
    }
    SLIDER.addEventListener('input',()=>{
        STATE.reset();
        makeAndPopulateCells(parseInt(SLIDER.value));
    });
    return true;
}

// Returns true if Generate Random maze button can be properly set
function randomMazeInit() {
    let button = document.getElementById('random_maze_button');
    if (button == null) {
        fatalError('ERROR: 102');
        return false;
    }
    button.addEventListener('click', () => {
        generateRandomMaze(0.7);
    })
    return true;
}

// Randomly sets cells as walls based on cutoff
//     0 < cutoff < 1
function generateRandomMaze(cutoff:number) {
    let start = STATE.getCellArray().getStart();
    let end = STATE.getCellArray().getEnd();
    for (let x = 0; x < STATE.getCellArray().getBoardSize(); x++) {
        for (let y=0; y < STATE.getCellArray().getBoardSize();y++) {
            if (isSameCordinate(start,[x,y]) || isSameCordinate(end,[x,y])) {
                continue;
            }
            let rand = Math.random();
            if (rand > cutoff) {
                STATE.getCellArray().setWall([x,y]);
            }
        }
    }
}

// Returns false if failed, otherwise initializes global(s) for slider
function setSpeedSlider() {
    let slider = document.getElementById('simulation_speed_slider')! as HTMLInputElement;
    if (slider == null) {
        fatalError('ERROR: 103');
        return false
    }
    slider.addEventListener('input',()=>{
        let val = 10 - parseInt(slider.value);
        STATE.setSpeed(val*25);
    });
    return true;
}

// returns true if all simulation buttons are initialized
function initSimulationButtons():boolean {
    PAUSEBUTTON = document.getElementById('pause_button') as HTMLButtonElement;
    STARTBUTTON = document.getElementById('start_button') as HTMLButtonElement;
    STEPBUTTON = document.getElementById('step_button') as HTMLButtonElement;
    CLEARBUTTON = document.getElementById('clear_board_button') as HTMLButtonElement;
    let bfs = document.getElementById('bfs_radio') as HTMLDivElement;
    let dfs = document.getElementById('dfs_radio') as HTMLDivElement;
    let dij = document.getElementById('dijkstra_radio') as HTMLDivElement;
    let aStar = document.getElementById('a_star_radio') as HTMLDivElement;

    if (STEPBUTTON == null) {
        fatalError('ERROR: 104');
        return false;
    }
    if (PAUSEBUTTON == null) {
        fatalError('ERROR: 105');
        return false;
    }
    if (STARTBUTTON == null) {
        fatalError('ERROR: 106');
        return false;
    }
    if (CLEARBUTTON == null) {
        fatalError('ERROR: 107');
        return false;
    }
    if (bfs == null) {
        fatalError('ERROR: 108')
        return false;
    }
    if (dfs == null) {
        fatalError('ERROR: 109')
        return false;
    }
    if (dij == null) {
        fatalError('ERROR: 110')
        return false;
    }
    if (aStar == null) {
        fatalError('ERROR: 111')
        return false;
    }
    ALGORITHMRADIOS = [bfs,dfs,dij,aStar]
    selectRadio(0);

    return true;
}

// Adds Event listeners on Radio buttons
function addEventListenersOnRadioButtons() {
    for (let index = 0; index < ALGORITHMRADIOS.length; index++) {
        const element = ALGORITHMRADIOS[index];
        element.addEventListener('click',()=>{
            selectRadio(index);
        })
    }
}

function selectRadio(i: number) {
    resetRadios();
    ALGORITHMRADIOS[i].classList.add('radio_selected');
    if (i != 0 && i != 1 && i != 2 && i != 3) {
        fatalError('ERROR: 201');
    } else {
        CURRENTRADIO = i;
    }
}

// Resets the styling of radio buttons
function resetRadios() {
    for (let index = 0; index < ALGORITHMRADIOS.length; index++) {
        const element = ALGORITHMRADIOS[index];
        element.classList.remove('radio_selected');
    }
}

// Adds logic for Simulation buttons
function addEventListenersOnSimulationButtons() {

    STEPBUTTON.addEventListener('click', () => {
        SEARCH.computeOnce();
    })

    PAUSEBUTTON.addEventListener('click', () => {
        SEARCH.pause();
        STARTBUTTON.disabled = false;
        STEPBUTTON.disabled = false;
        PAUSEBUTTON.disabled = true;
    })

    STARTBUTTON.addEventListener('click', () => {
        if (STATE.getCellArray().isStartEndSet()){
            // Ready
            switch (CURRENTRADIO) {
                case 0:
                    SEARCH = new generalSearchClass(STATE,new Queue());
                    break;
                case 1:
                    SEARCH = new generalSearchClass(STATE,new Stack());
                    break;
                case 2:
                    SEARCH = new generalSearchClass(STATE,new randomRemove());
                    break;
                case 3:
                    let start = STATE.getCellArray().getStart();
                    let end = STATE.getCellArray().getEnd();
                    SEARCH = new generalSearchClass(STATE,new randomPushAll(start,end));
                    break;
                default:
                    fatalError('ERROR: 200');
                    break;
            }
            SEARCH.computeAllwithDelay();
            STARTBUTTON.disabled = true
            STEPBUTTON.disabled = true;
            PAUSEBUTTON.disabled = false;
        } else {
            // Not Ready
            notify('Select start and end points');
        }
    })

    CLEARBUTTON.addEventListener('click', () => {
        SEARCH.pause();
        SEARCH = new generalSearchClass(STATE,new Queue());
        STARTBUTTON.disabled = false;
        STEPBUTTON.disabled = false;
        PAUSEBUTTON.disabled = true;
        setTimeout(() => {
            STATE.clearBoard();
        }, STATE.getSpeed());
    })

}

// Populates the cells according to the number of cells in one direction
function makeAndPopulateCells(numberOfCells:number) {
    for (let y = 0; y < numberOfCells; y++) {
        for (let x = 0; x < numberOfCells; x++) {

            let element = document.createElement('div');
            element.style.width = (100 / numberOfCells) + '%';
            element.style.height = (100 / numberOfCells) + '%';
            element.title = x.toString() + ',' + y.toString();
            element.classList.add('unit_cell');

            CELL_CONTAINER.getElement().appendChild(element);

            let cell = new UnitCell(x,y,element);
            STATE.getCellArray().push(cell);

        }
    }
}
