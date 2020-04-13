/**
 * Engine contains the basic framework for the game engine
 */

import { renderGameObjectsWith2dContext, initializeWith2dContext } from './Render.js';

let gameLoopStarted = false;
let stopLoop = null; // Magic reference to stop the game Loop
let currScene = null; // Current Scene to be rendering

let gameObjects = []; // Game Objects to process each loop
let gameObjectsIDs = new Set(); // Contains all GameObject IDs onscreen

export function initGameLoop() {
    if (!currScene) throw new Error("You must select a Scene First!");
    initializeWith2dContext();
    gameLoopStarted = true;
    main();
}

export function setCurrentScene(scene) {
    currScene = scene;
    let gos = scene.gameObjects;
    gos.forEach((go) => {
        enrollGameObject(go);
    })
}

export function enrollGameObject(go) {
    if (!go) return;
    // Check for ID
    if (gameObjectsIDs.has(go.id)) return;
    gameObjects.push(go);
    gameObjectsIDs.add(go.id);
}

export function deleteGameObject(go) {
    if (!go) return;
    if (!gameObjectsIDs.has(go.id)) return;
    setTimeout(() => {
        gameObjectsIDs.delete(go.id);
        // for ( let i = 0; i < gameObjects.length; i++) {
        //     let item = gameObjects[i];
        //     if (item.id === go.id) {

        //     }
        // }

        // @TODO Test this
        gameObjects.splice(gameObjects.indexOf(go), 1);
    });
}

// Game Loop
function main() {

    stopLoop = window.requestAnimationFrame(main); // Puts this function into the message queue

    // Render the Game Field
    renderGameObjectsWith2dContext(gameObjects);

    // Get Input

    // Run the GameObject Scripts

    // Do GameObject Physics

}