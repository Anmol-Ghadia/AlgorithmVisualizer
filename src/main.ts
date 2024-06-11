import { UnitCell, UnitCell2DArray, CellContainer, StateClass } from './classes.js';

let STATE: StateClass;
let CELL_ARRAY : UnitCell2DArray;
let CELL_CONTAINER: CellContainer;
let SLIDER: HTMLInputElement;

addEventListener('DOMContentLoaded',init);

// initilization routine
function init() {
    
    if (!setCellContinerGlobals()) return;
    if (!setSliderGlobals()) return;
    STATE = new StateClass(CELL_ARRAY,CELL_CONTAINER);
    
    if (!makeAndPopulateCells(parseInt(SLIDER.value))) return;
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

    CELL_CONTAINER.getElement().addEventListener("click",(event)=>{STATE.handleMouseDown(event)});

    return true;
}

// Returns false if failed, otherwise sets global(s) for slider
function setSliderGlobals() {
    SLIDER = document.getElementById('cell_count_slider')! as HTMLInputElement;
    if (SLIDER == null) {
        console.log('ERROR: 101');
        return false
    }
    SLIDER.addEventListener('input',sliderUpdated);
    return true;
}

// Handles the updates of changing the slider
function sliderUpdated() {
    // Dispose old cells
    CELL_ARRAY.clear();
    // populate new cells
    makeAndPopulateCells(parseInt(SLIDER.value));
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
