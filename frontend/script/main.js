import { canvas, initUI, toggleOverlay } from './ui.js';

import { initGameLoop, setCurrentScene, TARGET_MILLIS_PER_FRAME, deltaTime, spriteSheet } from './engine/Engine.js';

import Scene from './engine/Scene.js';

import GameObject from './engine/GameObject.js';

import Script from './engine/Script.js';

// TEST
import OPTIONS from '../asset/testOptions.js';

import Test from './game/Test.js';

import ControllerTest from './game/ControllerTest.js';

import { defineKey, TYPE_DIGITAL, setKeyOnNextInput, getAllKeys, setKeybindings } from './engine/Input.js';

import { initDebug } from './engine/Debug.js';

function main() {
    window.numGoombas = 0;
    initUI();

    initDebug();
    
    defineKey("test", TYPE_DIGITAL);
    defineKey("up", TYPE_DIGITAL);
    defineKey("down", TYPE_DIGITAL);
    defineKey("left", TYPE_DIGITAL);
    defineKey("right", TYPE_DIGITAL);
    setKeyOnNextInput("test");
    // let spritesheet = new SpriteSheet("/asset/test.png", 32, 32);
    spriteSheet.importFromOptions(OPTIONS);
    spriteSheet.ready.then(() => {

        // Set the Scene
        let scene = new Scene();
        
        scene.attachGameObject(new Test());

        scene.attachGameObject(new ControllerTest());
        
        setCurrentScene(scene);
        
        // Initialize the Game Loop
        initGameLoop();
        // TEMP: Testing strange behavior
        // window.debug.engine.stopGameLoop();
    })
}

main();