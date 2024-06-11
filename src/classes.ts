export {CellContainer,UnitCell,UnitCell2DArray};

class CellContainer {
    
    protected element: HTMLElement;

    constructor(ele: HTMLElement) {
        this.element = ele;
    }

    getElement() : HTMLElement {
        return this.element;
    }

    getX() : number {
        return this.element.getBoundingClientRect().x;
    }

    getY() : number {
        return this.element.getBoundingClientRect().y;
    }

    getWidth(): number {
        return this.element.getBoundingClientRect().width;
    }

    getHeight(): number {
        return this.element.getBoundingClientRect().height;
    }
}

class UnitCell2DArray {
    
    protected array: UnitCell[];

    constructor() {
        this.array = [];
    }

    push(cell: UnitCell) {
        this.array.push(cell);
    }
}

class UnitCell {

    // Position of this on grid
    protected posX: number;
    protected posY: number;
    protected element: HTMLDivElement;
    
    constructor(positionX:number, positionY:number,element:HTMLDivElement) {
        this.posX = positionX;
        this.posY = positionY;
        this.element = element;
    }
}
