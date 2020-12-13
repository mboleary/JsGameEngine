/**
 * Engine contains the basic framework for the game engine
 */

import { renderGameObjectsWith2dContext, initializeWith2dContext, initializeWithWebGL, renderGameObjectsWithWebGL } from './Render.js';

import { processGameObjectScripts, initGameObjectScripts } from './ScriptManager.js';

import { pollGamepads, initInput } from './Input.js';

import { pauseTime, unpauseTime, advanceTime, getTime } from './Time.js';

import { calculateAbsoluteTransform } from './Physics.js';

import { checkPuppets, disconnect } from './Puppeteer.js';

let gameLoopStarted = false;
let stopLoop = null; // Magic reference to stop the game Loop
let currScene = null; // Current Scene to be rendering

let gameObjects = []; // Game Objects to process each loop
let gameObjectsIDs = new Set(); // Contains all GameObject IDs onscreen

let gameObjectsByID = {}; // Stores GameObjects by ID (Unique)
let gameObjectsByName = {}; // Stores GameObjects by Name (Array)
let gameObjectsByGroup = {}; // Stores GameObjects by Group Name (Array)

export let deltaTime = 0; // Number of Milliseconds the previous frame took to render
export const TARGET_MILLIS_PER_FRAME = 16; // 60fps -> ~16 milliseconds
let prevTime = 0;
let currTime = 0;

// Keeps Track of Function that need to be run on each Event
let allowModuleLoading = true;
let initFuncs = []; // Initialization Functions
let loopFuncs = []; // Functions run on each Game Loop
let debugFuncs = []; // Functions run on Debug Events

// References passed to the JMods
const engineInternals = {
    gameObjects,
    currTime,
    TARGET_MILLIS_PER_FRAME
};

export function addJMod(jmod) {
    if (!allowModuleLoading) {
        throw new Error("Error: Attempted to load module after initialization!");
    }
    console.log(`Loading Module [${jmod.name || (jmod.constructor && jmod.constructor.name)}${(jmod.version || jmod.version === 0) ? " (v:" + jmod.version + ")" : ""}]...`);
    if (jmod.init) {
        initFuncs.push(jmod.init);
    }
    if (jmod.loop) {
        loopFuncs.push(jmod.loop);
    }
}

// Starts the Game Loop
export function initGameLoop() {
    if (!currScene) throw new Error("You must select a Scene First!");
    allowModuleLoading = false;

    // Initialize
    for (let i = 0; i < initFuncs.length; i++) {
        const f = initFuncs[i];
        f(engineInternals);
    }
    
    gameLoopStarted = true;
    currTime = window.performance.now();
    main();
}

// Initializes Debug Interface
export function initDebug() {
    let dbg = {};
    dbg.gameObjects = gameObjects;
    dbg.setCurrentScene = setCurrentScene;
    dbg.enrollGameObject = enrollGameObject;
    dbg.deleteGameObject = deleteGameObject;
    dbg.stopGameLoop = stopGameLoop;
    dbg.restartGameLoop = restartGameLoop;
    dbg.stepGameLoop = stepGameLoop;
    dbg.getTime = getTime;
    dbg.getGameObjectByID = getGameObjectByID;
    dbg.getGameObjectByName = getGameObjectByName;
    dbg.getGameObjectByGroup = getGameObjectByGroup;
    dbg.TARGET_MILLIS_PER_FRAME = TARGET_MILLIS_PER_FRAME;
    window.debug.engine = dbg;
}

export function stopGameLoop() {
    window.cancelAnimationFrame(stopLoop);
    disconnect();
    pauseTime();
}

/**
 * Run the GameLoop Once
 * @param {Number} fakeDelta If provided, will set the deltaTime
 */
export function stepGameLoop(fakeDelta) {
    setTimeout(() => {
        if (fakeDelta || fakeDelta === 0) {
            currTime = window.performance.now() - fakeDelta;
        }
        advanceTime(deltaTime);
        main();
        window.cancelAnimationFrame(stopLoop);
    });
}

// Only use this if re-starting the game after the loop was stopped.
export function restartGameLoop() {
    stopLoop = window.requestAnimationFrame(main);
    unpauseTime();
}

export function setCurrentScene(scene) {
    currScene = scene;
    enrollGameObject(scene);
}

// Enrolls GameObjects and their children, and initializes their scripts
export function enrollGameObject(go) {
    if (!go) return;
    // Check for ID
    if (gameObjectsIDs.has(go.id)) return;
    setTimeout(() => {
        let toInitScripts = {arr:[]};
        // Attach to the current Scene, unless we are attaching the scene itself!
        if (go.id !== currScene.id) {
            currScene.attachGameObject(go);
        }
        enrollGameObjectHelper(go, toInitScripts);
        initGameObjectScripts(toInitScripts.arr);
    });
}

/**
 * Enrolls the Children, as well as the parent GameObject
 * @param {GameObject} go GameObject to enroll
 * @param {Object} refArr Reference Array encapsulated by an object to add all of the references to the added GOs to
 */
function enrollGameObjectHelper(go, refArr) {
    if (!refArr || refArr.arr === undefined) return;
    if (gameObjectsIDs.has(go.id)) return;
    refArr.arr.push(go); // Reference Array of things to Initialize
    gameObjectsIDs.add(go.id); // Enforce that each GameObject is only added once
    gameObjects.push(go);
    // Add to Group Name List
    if (!gameObjectsByGroup[go.group]) {
        gameObjectsByGroup[go.group] = [];
    }
    gameObjectsByGroup[go.group].push(go);
    // Add ID
    gameObjectsByID[go.id] = go;
    // Add to GameObject Name List
    if (!gameObjectsByName[go.name]) {
        gameObjectsByName[go.name] = [];
    }
    gameObjectsByName[go.name].push(go);
    // Add the children
    if (go.children && go.children.length > 0) {
        go.children.forEach((child) => {
            enrollGameObjectHelper(child, refArr);
        });
    }
    return refArr;
}

// @TODO Fix this. It may call beforeDestroy many times. This is not intended!
export function deleteGameObject(go) {
    if (!go) return;
    if (!gameObjectsIDs.has(go.id)) return;
    // Done after the Loop, since we don't want to modify the array while it's being accessed
    setTimeout(() => {
        gameObjectsIDs.delete(go.id);
        let toDel = null;

        // Delete Entry in Array
        for (let i = 0; i < gameObjects.length; i++) {
            let item = gameObjects[i];
            if (item.id === go.id) {
                toDel = gameObjects[i];
                gameObjectsIDs.delete(toDel.id);
                delete gameObjectsByID[go.id];
                // Remove from GameObject Name Array
                for (let j = 0; j < gameObjectsByName[go.name].length; j++) {
                    if (gameObjectsByName[go.name][j].id === go.id) {
                        gameObjectsByName[go.name].splice(j, 1);
                        break;
                    }
                }
                // Remove from GameObject Group Array
                for (let j = 0; j < gameObjectsByGroup[go.group].length; j++) {
                    if (gameObjectsByGroup[go.group][j].id === go.id) {
                        gameObjectsByGroup[go.group].splice(j, 1);
                        break;
                    }
                }
                toDel.beforeDestroy();
                gameObjects.splice(i, 1);
                break;
            }
        }

        if (!toDel) return; // Item was not found

        // Delete Parent's child instance (if any)
        if (toDel.parent != null && toDel.parent.children && toDel.parent.children.length) {
            for (let i = 0; i < toDel.parent.children.length; i++) {
                let item = toDel.parent.children[i];
                if (item.id === go.id) {
                    item.beforeDestroy();
                    toDel.parent.children.splice(i, 1);
                    break;
                }
            }
        }

        // Delete the Children from the Array
        if (toDel.children && toDel.children.length) {
            let idsToFind = {arr:[]}; // Encapsulating in a Object to get Pass by reference
            for (let i = 0; i < toDel.children.length; i++) {
                getChildIDs(toDel.children[i], idsToFind);
            }
            // Remove Children from the ID Set, and other things
            for (let i = 0; i < idsToFind.arr.length; i++) {
                let go = idsToFind[i];
                gameObjectsIDs.delete(go.id);
                delete gameObjectsByID[go.id];
                // Remove from GameObject Name Array
                for (let j = 0; j < gameObjectsByName[go.name].length; j++) {
                    if (gameObjectsByName[go.name][j].id === go.id) {
                        gameObjectsByName[go.name].splice(j, 1);
                        break;
                    }
                }
                // Remove from GameObject Group Array
                for (let j = 0; j < gameObjectsByGroup[go.group].length; j++) {
                    if (gameObjectsByGroup[go.group][j].id === go.id) {
                        gameObjectsByGroup[go.group].splice(j, 1);
                        break;
                    }
                }
            }
            // Find in the GameObject Array and remove
            for (let i = 0; i < gameObjects.length && idsToFind.arr.length > 0; i++) {
                for (let j = 0; j < idsToFind.arr.length; j++) {
                    if (gameObjects[i].id === idsToFind.arr[j].id) {
                        gameObjects[i].beforeDestroy();
                        idsToFind.arr.splice(j, 1);
                        gameObjects.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }
        
    });
}

/**
 * Gets the IDs of all of the children
 * @param {GameObject} go GameObject to get the IDs of
 * @param {Object} idArr reference to an object encapsulating an array that the IDs will be added to
 */
function getChildIDs(go, idArr) {
    if (!idArr || idArr.arr === undefined) return;
    // let toRet = [];
    idArr.arr.push(go);
    if (go.children && go.children.length) {
        go.children.forEach((child) => {
            getChildIDs(child, idArr);
        });
    }
    return idArr.arr;
}

// Returns a reference to the GameObject by ID
export function getGameObjectByID(id) {
    if (gameObjectsByID[id]) {
        return gameObjectsByID[id];
    }
    return null;
}

// Return Gameobjects by name
export function getGameObjectByName(name) {
    if (gameObjectsByName[name]) {
        return gameObjectsByName[name];
    }
    return null;
}

// Return Gameobjects by group name
export function getGameObjectByGroup(group) {
    if (gameObjectsByGroup[group]) {
        return gameObjectsByGroup[group];
    }
    return null;
}

// Game Loop
function main() {
    // Update Delta Time
    prevTime = currTime;
    currTime = window.performance.now();
    deltaTime = currTime - prevTime;

    stopLoop = window.requestAnimationFrame(main); // Puts this function into the message queue

    // Calculate the Absolute Transforms of each GameObject
    // calculateAbsoluteTransform(gameObjects);

    // Render the Game Field
    // renderGameObjectsWith2dContext(gameObjects);

    // Get Input
    // pollGamepads();

    // Update Network State (if active)
    // checkPuppets();

    // Run the GameObject Scripts
    processGameObjectScripts(gameObjects);

    // Do GameObject Physics

    // Run loop functions
    for (let i = 0; i < loopFuncs.length; i++) {
        const f = loopFuncs[i];
        f(engineInternals);
    }

    // @TODO Remove this
    if (gameObjects.length > 10000) {
        console.log("Over 10 Thousand Objects");
    } else if (gameObjects.length > 100000) {
        console.log("Over 100 Thousand Objects");
    }

}