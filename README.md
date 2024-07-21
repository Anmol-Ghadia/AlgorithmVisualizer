# Pathfinding Algorithm Visualizer
This project is a web-based tool designed to visualize various pathfinding algorithms in action. It provides an interactive environment where users can see how algorithms like Breadth-First Search (`BFS`), Depth-First Search (`DFS`), Random Exploration, and A* (`A-star`) work in finding the shortest path from a starting point to a target node on a grid.

## Features:
1) Interactive Grid: Users can create walls and barriers on a grid, defining obstacles that algorithms must navigate around.
1) Algorithm Selection: Choose from multiple algorithms including BFS, DFS, Random Exploration, and A* to see each algorithm's approach to finding the shortest path.
1) Customizable Start and End Points: Set the start and end points on the grid to visualize how algorithms navigate from the starting position to the destination.
1) Visualization Controls: Control the speed of the visualization to observe each step of the algorithm's process.
1) Real-time Visualization: Algorithms run in real-time, updating the grid step-by-step so users can see how each algorithm makes decisions at every stage.
1) Clear Path Visualization: Once a path is found, it's visually highlighted on the grid to distinguish it from other paths or obstacles.

## How to Use:
1) Select Cell Count: Choose then number of cells for simulation. (Leave default if unsure)
1) Select Algorithm: Choose one of the available algorithms from the menu (BFS, DFS, Random, A*).
1) Set Start and End Points: Click on the grid to define the start and end points for the pathfinding algorithms.
1) Place Obstacles: Click on the grid cells to create walls or barriers.
1) Run Visualization: Start the visualization to see the selected algorithm in action.
1) Adjust Speed: Use the speed control to adjust the visualization speed according to your preference.
1) Reset and Try Again: Reset the grid to start over with a new setup or algorithm.

## Technologies Used:
1) HTML/CSS/JavaScript: Front-end development for creating the interactive grid and controls.
1) Pathfinding Algorithms: Implemented algorithms such as BFS, DFS, Random Search, and A* in JavaScript to handle pathfinding logic.
1) Responsive Design: Ensures the tool works well on both desktop and mobile browsers.

## Demo
Try the demo at this [link](). Visit the Pathfinding Algorithm Visualizer to see the tool in action.

---
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
1) 108: Element with `id="bfs_radio"` is null during init
1) 109: Element with `id="dfs_radio"` is null during init
1) 110: Element with `id="dijkstra_radio"` is null during init
1) 111: Element with `id="a_star_radio"` is null during init
1) 200: Error with Radio button for Algorithms
1) 201: Error with Radio button, index out of bounds

### TODO
1) Add help button that links to explanation of each algorithm
1) Slider Styling
1) ~~Add source button that links to github~~
1) ~~Walls should not be allowed to set once the algorithm has begun~~
1) ~~notification and error signs should fly in from edge as user  cannot select anything behind the sign even if opacity=0~~
1) ~~Polish styling~~
1) ~~Add css~~
1) ~~clear does not work when board is partially filled (ex. only start is set)~~
1) ~~Reduce max number of cells that can be added~~
1) ~~Reset Title of cells when board is cleared~~
1) ~~Configure Parameters for the cell container~~
1) ~~Make General search algorithm efficient wherever possible~~
1) ~~add support for different channels of logging~~
1) ~~Add User notification for errors~~
1) ~~Scale up to allow faster simulation speeds~~
1) ~~Add a stop feature for the pause/continue algorithm~~
1) ~~Clearing the board during search algorithm is running should be handled properly~~
1) ~~Define a faster data structure for 2d storage of coordinates~~
1) ~~add Breadth first search~~
1) ~~Add Draggable feature for creating and destroying walls~~
1) ~~Keep only 3 modes, mode 2 can act as both create and destroy(like toggle)~~
1) ~~add slider to control number of squares~~
1) ~~make cell class~~