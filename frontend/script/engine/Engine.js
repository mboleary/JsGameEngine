/**
 * Engine contains the basic framework for the game engine
 */

import { renderGameObjectsWith2dContext, initializeWith2dContext } from './Render.js';

import { processGameObjectScripts, initGameObjectScripts } from './ScriptManager.js';

import { pollGamepads, initInput } from './Input.js';

import SpriteSheet from './SpriteSheet.js';

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
    initGameObjectScripts(gameObjects);

    gameLoopStarted = true;
    currTime = window.performance.now();
    main();
}

export function setCurrentScene(scene) {
    currScene = scene;
    let gos = scene.gameObjects;
    gos.forEach((go) => {
        enrollGameObject(go);
    })
}

// @TODO Also enroll the Children too!
export function enrollGameObject(go) {
    if (!go) return;
    // Check for ID
    if (gameObjectsIDs.has(go.id)) return;
    setTimeout(() => {
        gameObjects.push(go);
        gameObjectsIDs.add(go.id);
        initGameObjectScripts([go]);
    })
}

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
            let idsToFind = [];
            for (let i = 0; i < toDel.children.length; i++) {
                let ids = getChildIDs(toDel.children[i]);
                ids.forEach((item) => idsToFind.push(item));
            }
            for (let i = 0; i < gameObjects.length && idsToFind.length > 0; i++) {
                for (let j = 0; j < idsToFind.length; j++) {
                    if (gameObjects[i].id === idsToFind[j]) {
                        gameObjects[i].beforeDestroy();
                        idsToFind.splice(j, 1);
                        gameObjects.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }
        
    });
}

function getChildIDs(go) {
    let toRet = [];
    toRet.push(go.id);
    if (go.children && go.children.length) {
        go.children.forEach((child) => {
            let res = getChildIDs(child);
            res.forEach(item => toRet.push(item));
        });
    }
    return toRet;
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