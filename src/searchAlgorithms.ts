export {
    breadthFirstSearch,
    depthFirstSearch,
    randomCellSearch,
    randomDirectionSearch
}

import {
    StateClass
} from './classes.js';
import {
    Queue,
    Stack,
    randomRemove,
    randomPushAll,
    generalSearchAlgorithm
} from './utils.js';

function breadthFirstSearch(STATE:StateClass) {
    let dataStructure = new Queue();
    generalSearchAlgorithm(STATE,dataStructure);
}

function depthFirstSearch(STATE:StateClass) {
    let dataStructure = new Stack();
    generalSearchAlgorithm(STATE,dataStructure);
}

function randomCellSearch(STATE:StateClass) {
    let dataStructure = new randomRemove();
    generalSearchAlgorithm(STATE,dataStructure);
}

function randomDirectionSearch(STATE:StateClass) {
    let dataStructure = new randomPushAll();
    generalSearchAlgorithm(STATE,dataStructure);
}
