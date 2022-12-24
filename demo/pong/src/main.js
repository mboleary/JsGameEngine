/**
 * Initializes the game and starts the execution loop
 */

import { Engine } from "jsge-core";
import { RenderModule, setCanvas } from "jsge-module-graphics2d";
import { loadGameScene } from "./scene.temp";

import { inputModuleInstance } from "./modules/input.instance";

export const canvas = document.getElementById('canvas');
export const overlay = document.getElementById('overlay');

function main() {
    const modules = [
        inputModuleInstance,
        new RenderModule(),
    ];

    // @TODO implement real options for render module
    setCanvas(canvas);
    resizeScreen();
    window.addEventListener("resize", resizeScreen);
    setOverlayVisibility(false);

    // @TODO implement real options for input module
    // defineKey("test", TYPE_DIGITAL);
    // defineKey("up", TYPE_DIGITAL);
    // defineKey("down", TYPE_DIGITAL);
    // defineKey("left", TYPE_DIGITAL);
    // defineKey("right", TYPE_DIGITAL);
    // Set Default Keymappings
    // setKeybindings({"test":{"state":0,"mapping":["k",32],"mappingName":" ","type":1},"up":{"state":0,"mapping":["k",38],"mappingName":"ArrowUp","type":1},"down":{"state":0,"mapping":["k",40],"mappingName":"ArrowDown","type":1},"left":{"state":0,"mapping":["k",37],"mappingName":"ArrowLeft","type":1},"right":{"state":0,"mapping":["k",39],"mappingName":"ArrowRight","type":1}});



    Engine.initialize({
        modules
    });

    // Engine.setCurrentScene();
    const scene = loadGameScene();
    Engine.setCurrentScene(scene);
    Engine.start();
}

// @TODO put these into the render module
function resizeScreen(e) {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth);
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight);
    console.log("Screen:", width, height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
}

export function setOverlayVisibility(visible) {
    if (visible) {
        overlay.removeAttribute("hidden");
    } else {
        overlay.setAttribute("hidden", "");
    }
}
// END TODO

main();