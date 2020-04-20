/**
 * Engine contains the basic framework for the game engine
 */

import { renderGameObjectsWith2dContext, initializeWith2dContext } from './Render.js';

import { processGameObjectScripts, initGameObjectScripts } from './ScriptManager.js';

import { pollGamepads, initInput } from './Input.js';

import SpriteSheet from './SpriteSheet.js';

import { pauseTime, unpauseTime, advanceTime, getTime } from './Time.js';

let gameLoopStarted = false;
let stopLoop = null; // Magic reference to stop the game Loop
let currScene = null; // Current Scene to be rendering

let gameObjects = []; // Game Objects to process each loop
let gameObjectsIDs = new Set(); // Contains all GameObject IDs onscreen

export let deltaTime = 0; // Number of Milliseconds the previous frame took to render
export const TARGET_MILLIS_PER_FRAME = 16; // 60fps -> ~16 milliseconds
let prevTime = 0;
let currTime = 0;

export const spriteSheet = new SpriteSheet();

// Starts the Game Loop
export function initGameLoop() {
    if (!currScene) throw new Error("You must select a Scene First!");
    initInput();
    initializeWith2dContext();
    // initGameObjectScripts(gameObjects); // This is done when the scene is imported

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
    dbg.TARGET_MILLIS_PER_FRAME = TARGET_MILLIS_PER_FRAME;
    window.debug.engine = dbg;
}

export function stopGameLoop() {
    window.cancelAnimationFrame(stopLoop);
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
    // let gos = scene.gameObjects;
    // gos.forEach((go) => {
    //     enrollGameObject(go);
    // });
}

// @TODO Also enroll the Children too!
export function enrollGameObject(go) {
    if (!go) return;
    // Check for ID
    if (gameObjectsIDs.has(go.id)) return;
    setTimeout(() => {
        let toInitScripts = {arr:[]};
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
    gameObjects.push(go);
    refArr.arr.push(go);
    gameObjectsIDs.add(go.id);
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
            for (let i = 0; i < gameObjects.length && idsToFind.arr.length > 0; i++) {
                for (let j = 0; j < idsToFind.arr.length; j++) {
                    if (gameObjects[i].id === idsToFind.arr[j]) {
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
    idArr.arr.push(go.id);
    if (go.children && go.children.length) {
        go.children.forEach((child) => {
            getChildIDs(child, idArr);
        });
    }
    return idArr.arr;
}



// Game Loop
function main() {
    // Update Delta Time
    prevTime = currTime;
    currTime = window.performance.now();
    deltaTime = currTime - prevTime;

    stopLoop = window.requestAnimationFrame(main); // Puts this function into the message queue

    // Render the Game Field
    renderGameObjectsWith2dContext(gameObjects);

    // Get Input
    pollGamepads();

    // Run the GameObject Scripts
    processGameObjectScripts(gameObjects);

    // Do GameObject Physics

    // @TODO Remove this
    if (gameObjects.length > 10000) {
        console.log("Over 10 Thousand Objects");
    } else if (gameObjects.length > 100000) {
        console.log("Over 100 Thousand Objects");
    }

}