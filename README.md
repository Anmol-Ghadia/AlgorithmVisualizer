# AlgorithmVisualizer

### TODO
1) add support for different channels of logging
1) Configure Parameters for the cell container
1) Make General search algorithm efficient wherever possible
1) Add User notification for errors
1) Add css
1) Polish styling
1) clear does not work when board is partiall filled (ex. only start is set)
1) Reduce max number of cells that can be added
1) Scale up to allow faster simulation speeds
1) ~~Add a stop feature for the pause/continue algorithm~~
1) ~~Clearing the board during search algorithm is running should be handled properly~~
1) ~~Define a faster data structure for 2d storage of coordinates~~
1) ~~add Breadth first search~~
1) ~~Add Draggable feature for creating and destroying walls~~
1) ~~Keep only 3 modes, mode 2 can act as both create and destroy(like toggle)~~
1) ~~add slider to control number of squares~~
1) ~~make cell class~~


### Developer Instructions

1) To instal `node_modules`
    ```BASH
    npm install
    ```
1) For compiling TypeScript files
    ```BASH
    npx tsc -w
    ```

### Errors
1) 100: Element with `id="cell_container"` is null during init
1) 101: Element with `id="cell_count_slider"` is null during init
1) 102: Element with `id="random_maze_button"` is null during init
1) 103: Element with `id="simulation_speed_slider"` is null during init
1) 104: Element with `id="step_button"` is null during init
1) 105: Element with `id="pause_button"` is null during init
1) 106: Element with `id="start_button"` is null during init
1) 107: Element with `id="clear_board_button"` is null during init
1) 200: Error with Radio button for Algorithms
