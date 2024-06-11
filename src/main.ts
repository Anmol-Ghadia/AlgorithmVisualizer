// Temp
import { UnitCell, UnitCell2DArray, CellContainer } from './classes.js';

// ==========

// let CELL_CONTAINER : HTMLElement;

let FACTOR = 10;
let CELL_ARRAY : UnitCell2DArray;
let CELL_CONTAINER: CellContainer;

addEventListener('load',init);

// initilization routine
function init() {
    if (!setCellContinerGlobals()) return;
    if (!makeAndPopulateCells(5,1)) return;

}

// Returns false if failed, otherwise sets globals regarding container
function setCellContinerGlobals() : boolean {
    let temp_element = document.getElementById('cell_container')!;
    if (temp_element == null) {
        console.log('ERROR: 100');
        return false;
    }

    CELL_CONTAINER = new CellContainer(temp_element);
    CELL_ARRAY = new UnitCell2DArray();

    CELL_CONTAINER.getElement().addEventListener("click",handleContainerClick);

    return true;
}

// Creates Cells as specified by user
//     cellSize is arbitrary
//     borderSize in pexels
function makeAndPopulateCells(cellSize:number,borderSize:number) : boolean {

    let xCellCount= Math.floor(CELL_CONTAINER.getWidth() / (cellSize * FACTOR));
    let cellWidthWithBorder = Math.floor(CELL_CONTAINER.getWidth() / xCellCount);
    let cellWidth = cellWidthWithBorder - borderSize*2;

    let yCellCount = Math.floor(CELL_CONTAINER.getHeight() / (cellSize * FACTOR));
    let cellHeightWithBorder = Math.floor(CELL_CONTAINER.getHeight() / yCellCount);
    let cellHeight = cellHeightWithBorder - borderSize*2;

    for (let y = 0; y < yCellCount; y++) {
        for (let x = 0; x < xCellCount; x++) {

            let element = document.createElement('div');
            element.style.width = cellWidth.toString() + 'px';
            element.style.height = cellHeight.toString() + 'px';
            element.classList.add('unit_cell');

            CELL_CONTAINER.getElement().appendChild(element);

            let cell = new UnitCell(x,y,element);
            CELL_ARRAY.push(cell);

        }
    }

    return true;
}

function handleContainerClick(e: Event) {
    console.log(e);
}
